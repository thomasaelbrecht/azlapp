import { pgTable, uuid, varchar, boolean, timestamp, index, date, time, decimal, integer, text } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { groups } from "./groups";
import { relations } from "drizzle-orm";

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: date("date").notNull(),
    groupId: uuid("group_id")
      .references(() => groups.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    start: time("start").notNull(),
    end: time("end").notNull(),
    entrancePrice: decimal("entrance_price", {
      precision: 2,
      scale: 2,
    }),
    wasLifeguard: boolean("was_lifeguard").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("job_user_idx").on(table.userId)],
);

export const contests = pgTable(
  "contests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: date("date").notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("contest_user_idx").on(table.userId)],
);

export const lifeguardJobs = pgTable(
  "lifeguard_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: date("date").notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    start: time("start").notNull(),
    end: time("end").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("lifeguard_user_idx").on(table.userId)],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    amountPerHour: decimal("amount_per_hour", {
      precision: 4,
      scale: 2,
    }).notNull(),
    totalAmountPayed: decimal("total_amount_payed", {
      precision: 10,
      scale: 2,
    }).notNull(),
    note: text("note"),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("payment_user_month_year_idx").on(table.userId, table.month, table.year)],
);

export const jobsRelations = relations(jobs, ({ one }) => ({
  group: one(groups, {
    fields: [jobs.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
}));

export const contestsRelations = relations(contests, ({ one }) => ({
  user: one(users, {
    fields: [contests.userId],
    references: [users.id],
  }),
}));

export const lifeguardJobsRelations = relations(lifeguardJobs, ({ one }) => ({
  user: one(users, {
    fields: [lifeguardJobs.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));
