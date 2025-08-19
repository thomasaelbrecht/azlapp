import { relations } from "drizzle-orm";
import { pgTable, text, jsonb, uuid, varchar, boolean, timestamp, index, pgEnum, date, decimal, time } from "drizzle-orm/pg-core";

export const groups = pgTable(
  "groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    extraPerLesson: decimal("extra_per_lesson", {
      precision: 4,
      scale: 2,
    }).default("0.00"),
    detailedHours: boolean("detailed_hours").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("group_name_idx").on(table.name)],
);

export const genderEnum = pgEnum("gender_enum", ["M", "F", "X"]);

export const members = pgTable(
  "members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    birthDate: date("birth_date").notNull(),
    emails: jsonb("emails").notNull(),
    gender: genderEnum().notNull(),
    phones: jsonb("phones").notNull(),
    remarks: text("remarks"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("member_name_idx").on(table.firstName, table.lastName)],
);

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("name").notNull(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trainingDayEnum = pgEnum("training_day_enum", ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]);

export const trainings = pgTable("trainings", {
  id: uuid("id").primaryKey().defaultRandom(),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id),
  day: trainingDayEnum().notNull(),
  entrancePrice: decimal("entrance_price", {
    precision: 2,
    scale: 2,
  }).notNull(),
  start: time("start").notNull(),
  end: time("end").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userToTrainings = pgTable(
  "user_to_trainings",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    trainingId: uuid("training_id")
      .notNull()
      .references(() => trainings.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("user_training_idx").on(table.userId, table.trainingId)],
);

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(members),
  goals: many(goals),
  trainings: many(trainings),
}));

export const membersRelations = relations(members, ({ many }) => ({
  group: many(groups),
}));

export const trainingsRelations = relations(trainings, ({ one, many }) => ({
  group: one(groups, {
    fields: [trainings.groupId],
    references: [groups.id],
  }),
  userToTrainings: many(userToTrainings),
}));
