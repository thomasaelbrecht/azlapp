"use server";

import { revalidatePath } from "next/cache";
import { createGroup, deleteGroup, type GroupInput, updateGroup } from "@/services/groups";

function isUniqueViolation(error: unknown): boolean {
  const errorWithCode = error as { code?: string; cause?: { code?: string } };
  return errorWithCode?.code === "23505" || errorWithCode?.cause?.code === "23505";
}

export async function createGroupAction(input: GroupInput) {
  try {
    await createGroup(input);

    revalidatePath("/groups");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het aanmaken van de groep:", error);
    return {
      success: false,
      error: isUniqueViolation(error)
        ? "Er bestaat al een groep met deze naam of dit Assist team"
        : "Kon groep niet aanmaken",
    };
  }
}

export async function updateGroupAction({ id, ...input }: GroupInput & { id: string }) {
  try {
    await updateGroup(id, input);

    revalidatePath("/groups");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het bijwerken van de groep:", error);
    return {
      success: false,
      error: isUniqueViolation(error)
        ? "Er bestaat al een groep met deze naam of dit Assist team"
        : "Kon groep niet bijwerken",
    };
  }
}

export async function deleteGroupAction(id: string) {
  try {
    await deleteGroup(id);

    revalidatePath("/groups");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het verwijderen van de groep:", error);
    return { success: false, error: "Kon groep niet verwijderen" };
  }
}
