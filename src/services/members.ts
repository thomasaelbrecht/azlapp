import { and, count, eq, ilike, isNull, or, type SQL, sql } from "drizzle-orm";
import { db } from "@/db";
import { members } from "@/db/schema";
import type { Gender } from "@/types/members";
import { paginationParamsToSQL, sortParamsToSQL } from "@/utils/datatable";

export interface MemberFilters {
  search?: string;
  gender?: Gender;
  groupId?: string;
  birthYearFrom?: number;
  birthYearTo?: number;
  sort?: string | null;
  page?: number;
  pageSize?: number;
}

export interface MemberListItem {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  emails: string[];
  phones: string[];
  groups: { id: string; name: string }[];
}

const SORT_COLUMNS = {
  lastName: members.lastName,
  firstName: members.firstName,
  birthDate: members.birthDate,
} as const;

export async function getAllMembers({ page = 1, pageSize = 50, sort, ...filters }: MemberFilters = {}): Promise<{
  items: MemberListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const { limit, offset } = paginationParamsToSQL({ page, pageSize });
  const orderByClause = sortParamsToSQL({
    sortQuery: sort,
    sortColumnMapping: SORT_COLUMNS,
    defaultSortColumn: "lastName",
    defaultSortDirection: "ASC",
  });

  const conditions: (SQL<unknown> | undefined)[] = [isNull(members.deletedAt)];

  if (filters.gender) {
    conditions.push(eq(members.gender, filters.gender));
  }

  if (filters.birthYearFrom) {
    conditions.push(sql`EXTRACT(YEAR FROM ${members.birthDate}::date) >= ${filters.birthYearFrom}`);
  }

  if (filters.birthYearTo) {
    conditions.push(sql`EXTRACT(YEAR FROM ${members.birthDate}::date) <= ${filters.birthYearTo}`);
  }

  if (filters.search) {
    const term = `%${filters.search.trim()}%`;
    conditions.push(
      or(
        ilike(members.firstName, term),
        ilike(members.lastName, term),
        sql`${members.firstName} || ' ' || ${members.lastName} ilike ${term}`,
      ),
    );
  }

  if (filters.groupId) {
    conditions.push(
      sql`${members.id} IN (SELECT member_id FROM members_to_groups WHERE group_id = ${filters.groupId})`,
    );
  }

  const [totalResult] = await db
    .select({ count: count() })
    .from(members)
    .where(and(...conditions));

  const total = totalResult?.count ?? 0;

  const items = await db.query.members.findMany({
    with: {
      membersToGroups: {
        with: {
          group: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    where: and(...conditions),
    orderBy: orderByClause,
    limit,
    offset,
  });

  return {
    items: items.map(({ membersToGroups, ...member }) => ({
      ...member,
      groups: membersToGroups.map(mtg => mtg.group),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
