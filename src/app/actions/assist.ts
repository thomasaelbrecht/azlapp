"use server";

import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/safe-action";
import { performAssistSync, updateAssistSettings } from "@/services/assist";
import type { UpdateAssistSettings } from "@/types/settings";

export async function updateAssistSettingsAction(settings: UpdateAssistSettings) {
  try {
    // Check if settings exist
    await updateAssistSettings(settings);

    revalidatePath("/admin/assist");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het bijwerken van Assist instellingen:", error);
    return { success: false, error: "Kon instellingen niet bijwerken" };
  }
}

export const memberSyncAction = actionClient.action(async () => {
  try {
    const result = await performAssistSync();
    revalidatePath("/admin/assist");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Fout bij het synchroniseren van leden:", error);
    return { success: false, error: error instanceof Error ? error.message : "Kon leden niet synchroniseren" };
  }
});
