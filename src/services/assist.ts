import { eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { assistSettings, members } from "@/db/schema";
import { AssistApi } from "@/lib/api/assist";
import type { WorkingYear } from "@/types/api/assist";
import { Gender } from "@/types/members";
import type { CreateAssistSettings } from "@/types/settings";

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

export async function updateAssistSettings(data: CreateAssistSettings): Promise<void> {
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

export async function syncMembers(): Promise<{ total: number; created: number; updated: number; deleted: number }> {
  const settings = await db.query.assistSettings.findFirst();
  if (!settings?.currentWorkingYearId) {
    throw new Error("Geen werkjaar ingesteld. Stel een werkjaar in voordat je leden synchroniseert.");
  }

  const assistApi = getAssistApiInstance();
  const allMembers = (
    await assistApi.filterMembers({
      WorkingYearId: settings.currentWorkingYearId,
      $count: true,
      IsDroppedOut: false,
    })
  ).items;

  // Perform all database operations in a transaction
  return await db.transaction(async tx => {
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
  });
}
