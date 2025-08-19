import { pgTable, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobTotalPrecision: jsonb("job_total_precision").notNull(),
  jobTotalExtraCoordinator: jsonb("job_total_extra_coordinator").notNull(),
  jobTotalExtraLifeguard: jsonb("job_total_extra_lifeguard").notNull(),
  jobTotalDefaultAmountPerHour: jsonb("job_total_default_amount_per_hour").notNull(),
  jobTotalAmountPerContest: jsonb("job_total_amount_per_contest").notNull(),
  jobTotalAmountPerLifeguardTask: jsonb("job_total_amount_per_lifeguard_task").notNull(),
  jobTotalAssociationWorkTax: jsonb("job_total_association_work_tax").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
