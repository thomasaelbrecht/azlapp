import type { assistSettings } from "@/db/schema/settings";

export type AssistSettings = typeof assistSettings.$inferSelect;
export type UpdateAssistSettings = typeof assistSettings.$inferInsert;
