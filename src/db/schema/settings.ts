import { integer, jsonb, pgTable, uuid } from "drizzle-orm/pg-core";

export const jobTotalSettings = pgTable("job_total_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  precision: jsonb("job_total_precision").notNull(),
  extraCoordinator: jsonb("job_total_extra_coordinator").notNull(),
  extraLifeguard: jsonb("job_total_extra_lifeguard").notNull(),
  defaultAmountPerHour: jsonb("job_total_default_amount_per_hour").notNull(),
  amountPerContest: jsonb("job_total_amount_per_contest").notNull(),
  amountPerLifeguardTask: jsonb("job_total_amount_per_lifeguard_task").notNull(),
  associationWorkTax: jsonb("job_total_association_work_tax").notNull(),
});

export const assistSettings = pgTable("assist_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  currentWorkingYearId: integer("assist_current_working_year_id").notNull(),
});
