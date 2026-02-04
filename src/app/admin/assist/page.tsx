import { AssistSettingsForm } from "@/components/admin/assist-settings-form";
import { PageLayout } from "@/components/layout/page-layout";
import { getWorkingYears } from "@/services/assist";
import { getAssistSettings } from "@/services/settings";

export default async function AssistAdminPage() {
  const [assistSettings, workingYears] = await Promise.all([getAssistSettings(), getWorkingYears()]);

  return (
    <PageLayout title="Assist integratie">
      <div className="flex flex-1 flex-col gap-6">
        <AssistSettingsForm initialSettings={assistSettings} workingYears={workingYears} />
      </div>
    </PageLayout>
  );
}
