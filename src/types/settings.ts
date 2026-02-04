import type { assistSettings } from "@/db/schema/settings";

export type AssistSettings = typeof assistSettings.$inferSelect;
export type CreateAssistSettings = typeof assistSettings.$inferInsert;
