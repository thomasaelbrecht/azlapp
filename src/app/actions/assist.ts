"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assistSettings } from "@/db/schema/settings";
import { db } from "@/lib/db";
import { syncMembers } from "@/services/assist";

export async function updateAssistSettings(currentWorkingYearId: number) {
  try {
    // Check if settings exist
    const existingSettings = await db.select().from(assistSettings).limit(1);

    if (existingSettings.length > 0) {
      // Update existing settings
      await db
        .update(assistSettings)
        .set({ currentWorkingYearId })
        .where(eq(assistSettings.currentWorkingYearId, existingSettings[0].currentWorkingYearId));
    } else {
      // Insert new settings
      await db.insert(assistSettings).values({ currentWorkingYearId });
    }

    revalidatePath("/admin/assist");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het bijwerken van Assist instellingen:", error);
    return { success: false, error: "Kon instellingen niet bijwerken" };
  }
}

export async function triggerMemberSync() {
  try {
    const result = await syncMembers();
    revalidatePath("/admin/assist");

    return {
      success: true,
      message: `${result.total} leden succesvol gesynchroniseerd (${result.created} aangemaakt, ${result.updated} bijgewerkt, ${result.deleted} verwijderd)`,
      data: result,
    };
  } catch (error) {
    console.error("Fout bij het synchroniseren van leden:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kon leden niet synchroniseren",
    };
  }
}
