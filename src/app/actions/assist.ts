"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assistSettings } from "@/db/schema/settings";
import { db } from "@/lib/db";

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
    console.error("Failed to update Assist settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function triggerMemberSync() {
  // Placeholder for future implementation
  console.info("Member sync triggered - not implemented yet");
  return { success: true, message: "Sync triggered successfully (placeholder)" };
}
