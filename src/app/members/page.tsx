import type { SearchParams } from "nuqs/server";
import { MemberTable } from "@/app/members/member-table";
import { PageLayout } from "@/components/layout/page-layout";
import { MemberSearchBar } from "@/components/members/member-search-bar";
import { getAllGroups } from "@/services/groups";
import { getAllMembers } from "@/services/members";
import type { Gender } from "@/types/members";
import { loadSearchParams } from "./search-params";

interface MembersPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const params = await loadSearchParams(searchParams);

  const [result, allGroups] = await Promise.all([
    getAllMembers({
      search: params.search || undefined,
      gender: (params.gender as Gender) || undefined,
      groupId: params.groupId || undefined,
      birthYearFrom: params.birthYearFrom ?? undefined,
      birthYearTo: params.birthYearTo ?? undefined,
      sort: params.sort,
      page: params.page,
      pageSize: 25,
    }),
    getAllGroups(),
  ]);

  return (
    <PageLayout title="Leden">
      <div className="flex flex-col gap-4">
        <MemberSearchBar groups={allGroups} />
        <MemberTable members={result.items} rowCount={result.total} />
      </div>
    </PageLayout>
  );
}
