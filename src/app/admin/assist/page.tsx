import { AssistSettingsForm } from "@/components/admin/assist-settings-form";
import { AssistMemberSync } from "@/components/admin/assist-sync";
import { PageLayout } from "@/components/layout/page-layout";
import { getMemberTeams, getWorkingYears } from "@/services/assist";
import { getAssistSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export default async function AssistAdminPage() {
  const [assistSettings, workingYears, memberTeams] = await Promise.all([
    getAssistSettings(),
    getWorkingYears(),
    getMemberTeams(),
  ]);

  return (
    <PageLayout title="Assist integratie">
      <div className="flex flex-1 flex-col gap-6">
        <AssistMemberSync hasInitialSettings={Boolean(assistSettings)} />
        <AssistSettingsForm
          initialSettings={assistSettings}
          workingYears={workingYears}
          memberTeams={memberTeams.items}
        />
      </div>
    </PageLayout>
  );
}
