"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db, type Transaction } from "@/db";
import { assistSettings, groups, members, membersToGroups } from "@/db/schema";
import { AssistApi } from "@/lib/api/assist";
import type { MemberTeamsResponse, WorkingYear } from "@/types/api/assist";
import { Gender } from "@/types/members";
import type { AssistSettings, UpdateAssistSettings } from "@/types/settings";

let assistApi: AssistApi | null = null;

function getAssistApiInstance() {
  if (!assistApi) {
    assistApi = new AssistApi();
  }
  return assistApi;
}

export async function getWorkingYears(): Promise<WorkingYear[]> {
  return await getAssistApiInstance().getWorkingYears();
}

export async function getMemberTeams(): Promise<MemberTeamsResponse> {
  return await getAssistApiInstance().getMemberTeams();
}

export async function updateAssistSettings(data: UpdateAssistSettings): Promise<void> {
  const years = await getWorkingYears();
  const validYear = years.find(year => year.id === data.currentWorkingYearId);
  if (!validYear) {
    throw new Error("Invalid working year ID");
  }

  const [existingSettings] = await db.select({ id: assistSettings.id }).from(assistSettings).limit(1);

  if (existingSettings) {
    await db.update(assistSettings).set(data).where(eq(assistSettings.id, existingSettings.id));
  } else {
    await db.insert(assistSettings).values(data);
  }
}

// TODO: first sync teams, then sync members and assign them to teams based on their Assist team memberships
export async function syncTeams(
  settings: AssistSettings,
  tx: Transaction,
): Promise<{ total: number; created: number; updated: number }> {
  const assistApi = getAssistApiInstance();
  const teamsResponse = await assistApi.getMemberTeams();

  // Flatten the nested teams structure using built-in flat method
  const flattenTeams = (teams: typeof teamsResponse.items): Array<(typeof teamsResponse.items)[0]> => {
    return teams.flatMap(team => [team, ...flattenTeams(team.children)]);
  };

  const allTeams = flattenTeams(teamsResponse.items);
  const syncedTeamIds = settings.syncedTeamIds as number[];

  // Only sync leaf teams, not the parents to avoid duplicates and confusion in the UI.
  const teamsToSync = allTeams
    .filter(team => syncedTeamIds.includes(team.id))
    .filter(team => team.children.length === 0);

  let created = 0;
  let updated = 0;

  for (const team of teamsToSync) {
    // Strip prefix from team name (e.g., "Jeugd/Sharks" -> "Sharks")
    const teamName = team.name.includes("/") ? team.name.split("/").pop()?.trim() || team.name : team.name;

    const existingGroup = await tx.query.groups.findFirst({
      where: eq(groups.assistTeamId, team.id),
    });

    if (existingGroup) {
      await tx
        .update(groups)
        .set({
          name: teamName,
          updatedAt: new Date(),
        })
        .where(eq(groups.id, existingGroup.id));
      updated++;
    } else {
      await tx.insert(groups).values({
        name: teamName,
        assistTeamId: team.id,
      });
      created++;
    }
  }

  return {
    total: teamsToSync.length,
    created,
    updated,
  };
}

export async function syncMembers(
  settings: AssistSettings,
  tx: Transaction,
): Promise<{ total: number; created: number; updated: number; deleted: number }> {
  const assistApi = getAssistApiInstance();
  const allMembers = (
    await assistApi.filterMembers({
      WorkingYearId: settings.currentWorkingYearId,
      IsDroppedOut: false,
    })
  ).items;

  // Perform all database operations in a transaction
  let created = 0;
  let updated = 0;

  for (const member of allMembers) {
    if (!member.person.birthDate || !member.person.genderId) {
      continue;
    }

    // Parse emails - split by comma or semicolon and trim whitespace
    const emailString = member.person.email || "";
    const emails = new Set(
      emailString
        .split(/[,;]/)
        .map(email => email.trim())
        .filter(email => email.length > 0),
    );

    const phones = new Set(
      [member.person.gsm, member.person.homePhone]
        .filter((phone): phone is string => phone !== null)
        .map(phone => phone.replace(/[\s/]+/g, "").replace(/^\+?32/, "0"))
        .filter(phone => phone.length > 0),
    );

    const memberData = {
      firstName: member.person.firstName,
      lastName: member.person.lastName,
      birthDate: member.person.birthDate.toISOString().split("T")[0],
      emails: [...emails],
      gender: member.person.genderId === 1 ? Gender.M : member.person.genderId === 2 ? Gender.F : Gender.X,
      phones: [...phones],
      remarks: null,
      assistPersonId: member.person.id,
      deletedAt: null, // Restore if previously soft deleted
    };

    const existingMember = await tx.query.members.findFirst({
      where: eq(members.assistPersonId, member.person.id),
    });

    if (existingMember) {
      await tx.update(members).set(memberData).where(eq(members.id, existingMember.id));
      updated++;
    } else {
      await tx.insert(members).values(memberData);
      created++;
    }
  }

  // Soft delete members that are no longer in the current working year
  const allExistingMembers = await tx.query.members.findMany({
    where: isNull(members.deletedAt),
  });
  const currentAssistPersonIds = new Set(allMembers.map(member => member.person.id));
  let deleted = 0;

  for (const existingMember of allExistingMembers) {
    if (!currentAssistPersonIds.has(existingMember.assistPersonId) && !existingMember.deletedAt) {
      await tx.update(members).set({ deletedAt: new Date() }).where(eq(members.id, existingMember.id));
      deleted++;
    }
  }

  return {
    total: allMembers.length,
    created,
    updated,
    deleted,
  };
}

export async function syncMemberGroups(settings: AssistSettings, tx: Transaction): Promise<{ assigned: number }> {
  const assistApi = getAssistApiInstance();
  const allMembers = (
    await assistApi.filterMembers({
      WorkingYearId: settings.currentWorkingYearId,
      IsDroppedOut: false,
    })
  ).items;

  const syncedTeamIds = settings.syncedTeamIds as number[];

  const allGroups = await tx.query.groups.findMany({
    where: isNull(groups.deletedAt),
  });
  const groupByAssistTeamId = new Map(
    allGroups.filter(g => g.assistTeamId !== null).map(g => [g.assistTeamId as number, g.id]),
  );

  let assigned = 0;

  for (const member of allMembers) {
    const dbMember = await tx.query.members.findFirst({
      where: and(eq(members.assistPersonId, member.person.id), isNull(members.deletedAt)),
    });

    if (!dbMember) continue;

    const memberTeamIds = member.assignedFunctions
      .filter(f => !f.disabled && syncedTeamIds.includes(f.teamId))
      .map(f => f.teamId);

    const uniqueTeamIds = [...new Set(memberTeamIds)];

    for (const teamId of uniqueTeamIds) {
      const groupId = groupByAssistTeamId.get(teamId);
      if (!groupId) continue;

      const existing = await tx.query.membersToGroups.findFirst({
        where: and(eq(membersToGroups.memberId, dbMember.id), eq(membersToGroups.groupId, groupId)),
      });

      if (!existing) {
        await tx.insert(membersToGroups).values({ memberId: dbMember.id, groupId });
        assigned++;
      }
    }
  }

  return { assigned };
}

export async function performAssistSync(): Promise<{
  teamSync: { total: number; created: number; updated: number };
  memberSync: { total: number; created: number; updated: number; deleted: number };
  memberGroupSync: { assigned: number };
}> {
  const settings = await db.query.assistSettings.findFirst();
  if (!settings?.currentWorkingYearId) {
    throw new Error("Geen werkjaar ingesteld. Stel een werkjaar in voordat je leden synchroniseert.");
  }

  return await db.transaction(async tx => {
    const teamSyncResult = await syncTeams(settings, tx);
    const memberSyncResult = await syncMembers(settings, tx);
    const memberGroupSyncResult = await syncMemberGroups(settings, tx);

    return {
      teamSync: teamSyncResult,
      memberSync: memberSyncResult,
      memberGroupSync: memberGroupSyncResult,
    };
  });
}
