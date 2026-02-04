import { db } from "@/db";
import type { AssistSettings } from "@/types/settings";

export async function getAssistSettings(): Promise<AssistSettings | null> {
  return (await db.query.assistSettings.findFirst()) || null;
}
