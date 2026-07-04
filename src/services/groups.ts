import { and, asc, count, eq, ilike, isNull, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { groups, members, membersToGroups } from "@/db/schema";
import { TrainingDay } from "@/types/groups";

export interface GroupFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface GroupListItem {
  id: string;
  name: string;
  extraPerLesson: string | null;
  detailedHours: boolean | null;
  assistTeamId: number | null;
  memberCount: number;
  trainings: { id: string; day: TrainingDay; start: string; end: string }[];
}

export interface GroupInput {
  name: string;
  extraPerLesson: number;
  detailedHours: boolean;
  assistTeamId: number | null;
}

const TRAINING_DAY_ORDER = Object.values(TrainingDay);

export async function getAllGroups(): Promise<{ id: string; name: string }[]> {
  return db
    .select({ id: groups.id, name: groups.name })
    .from(groups)
    .where(isNull(groups.deletedAt))
    .orderBy(asc(groups.name));
}

export async function getGroupsOverview({ page = 0, pageSize = 25, search }: GroupFilters = {}): Promise<{
  items: GroupListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const conditions: (SQL<unknown> | undefined)[] = [isNull(groups.deletedAt)];

  if (search) {
    conditions.push(ilike(groups.name, `%${search.trim()}%`));
  }

  const [totalResult] = await db
    .select({ count: count() })
    .from(groups)
    .where(and(...conditions));

  const total = totalResult?.count ?? 0;

  const [items, memberCounts] = await Promise.all([
    db.query.groups.findMany({
      columns: {
        id: true,
        name: true,
        extraPerLesson: true,
        detailedHours: true,
        assistTeamId: true,
      },
      with: {
        trainings: {
          columns: {
            id: true,
            day: true,
            start: true,
            end: true,
          },
        },
      },
      where: and(...conditions),
      orderBy: asc(groups.name),
      limit: pageSize,
      offset: page * pageSize,
    }),
    db
      .select({ groupId: membersToGroups.groupId, memberCount: count() })
      .from(membersToGroups)
      .innerJoin(members, eq(membersToGroups.memberId, members.id))
      .where(isNull(members.deletedAt))
      .groupBy(membersToGroups.groupId),
  ]);

  const memberCountByGroupId = new Map(memberCounts.map(({ groupId, memberCount }) => [groupId, memberCount]));

  return {
    items: items.map(({ trainings, ...group }) => ({
      ...group,
      memberCount: memberCountByGroupId.get(group.id) ?? 0,
      trainings: trainings.toSorted(
        (a, b) =>
          TRAINING_DAY_ORDER.indexOf(a.day) - TRAINING_DAY_ORDER.indexOf(b.day) || a.start.localeCompare(b.start),
      ),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function createGroup(input: GroupInput): Promise<void> {
  await db.insert(groups).values({
    name: input.name,
    extraPerLesson: input.extraPerLesson.toFixed(2),
    detailedHours: input.detailedHours,
    assistTeamId: input.assistTeamId,
  });
}

export async function updateGroup(id: string, input: GroupInput): Promise<void> {
  await db
    .update(groups)
    .set({
      name: input.name,
      extraPerLesson: input.extraPerLesson.toFixed(2),
      detailedHours: input.detailedHours,
      assistTeamId: input.assistTeamId,
      updatedAt: new Date(),
    })
    .where(and(eq(groups.id, id), isNull(groups.deletedAt)));
}

export async function deleteGroup(id: string): Promise<void> {
  await db.update(groups).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(groups.id, id));
}
