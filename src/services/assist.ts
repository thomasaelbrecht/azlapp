import { eq } from "drizzle-orm";
import { db } from "@/db";
import { assistSettings } from "@/db/schema";
import { AssistApi } from "@/lib/api/assist";
import type { WorkingYear } from "@/types/api/assist";
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
