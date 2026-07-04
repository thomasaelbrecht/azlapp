import type { SearchParams } from "nuqs/server";
import { GroupTable } from "@/app/groups/group-table";
import { CreateGroupButton } from "@/components/groups/create-group-button";
import { PageLayout } from "@/components/layout/page-layout";
import { SearchBar } from "@/components/ui/search-bar";
import { getLeafMemberTeams } from "@/services/assist";
import { getGroupsOverview } from "@/services/groups";
import { loadGroupSearchParams } from "./search-params";

interface GroupsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function GroupsPage({ searchParams }: GroupsPageProps) {
  const params = await loadGroupSearchParams(searchParams);

  const [result, assistTeams] = await Promise.all([
    getGroupsOverview({
      search: params.search || undefined,
      page: params.page,
      pageSize: params.pageSize,
    }),
    // The Assist team dropdown is optional; the page should still work when the Assist API is unavailable
    getLeafMemberTeams().catch(error => {
      console.error("Fout bij het ophalen van de Assist teams:", error);
      return [];
    }),
  ]);

  return (
    <PageLayout title="Groepen" actions={<CreateGroupButton assistTeams={assistTeams} />}>
      <div className="flex flex-col gap-4">
        <SearchBar />
        <GroupTable groups={result.items} assistTeams={assistTeams} rowCount={result.total} />
      </div>
    </PageLayout>
  );
}
