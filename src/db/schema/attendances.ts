import { pgTable, uuid, integer, timestamp, index, time, boolean, text } from "drizzle-orm/pg-core";
import { groups, members } from "./groups";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const attendanceSheets = pgTable(
  "attendance_sheets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: timestamp("date").notNull(),
    groupId: uuid("group_id")
      .references(() => groups.id)
      .notNull(),
    start: time("start"),
    end: time("end"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("attendance_group_idx").on(table.groupId), index("attendance_date_idx").on(table.date)],
);

export const attendanceSheetEdits = pgTable(
  "attendance_sheet_edits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sheetId: uuid("sheet_id")
      .references(() => attendanceSheets.id)
      .notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    date: timestamp("date").notNull().defaultNow(),
  },
  (table) => [index("attendance_sheet_edit_sheet_idx").on(table.sheetId)],
);

export const attendanceSheetNotes = pgTable("attendance_sheet_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  note: text("description").notNull(),
  solved: boolean("solved").default(false),
  extraInfo: text("extra_info"),
  createdById: uuid("created_by_id").references(() => users.id),
  groupId: uuid("group_id").references(() => groups.id),
  sheetId: uuid("sheet_id").references(() => attendanceSheets.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const attendees = pgTable(
  "attendees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sheetId: uuid("sheet_id")
      .notNull()
      .references(() => attendanceSheets.id, { onDelete: "cascade" }),
    memberId: uuid("user_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    numberOfHalfHours: integer("number_of_half_hours").default(0),
    note: text("note"),
    hasContest: boolean("has_contest").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("attendees_sheet_idx").on(table.sheetId)],
);

export const attendanceSheetsRelations = relations(attendanceSheets, ({ one, many }) => ({
  group: one(groups, {
    fields: [attendanceSheets.groupId],
    references: [groups.id],
  }),
  members: many(attendees),
  edits: many(attendanceSheetEdits),
  notes: many(attendanceSheetNotes),
}));

export const attendeesRelations = relations(attendees, ({ one }) => ({
  sheet: one(attendanceSheets, {
    fields: [attendees.sheetId],
    references: [attendanceSheets.id],
  }),
  member: one(members, {
    fields: [attendees.memberId],
    references: [members.id],
  }),
}));

export const attendanceSheetEditsRelations = relations(attendanceSheetEdits, ({ one }) => ({
  sheet: one(attendanceSheets, {
    fields: [attendanceSheetEdits.sheetId],
    references: [attendanceSheets.id],
  }),
  user: one(users, {
    fields: [attendanceSheetEdits.userId],
    references: [users.id],
  }),
}));

export const attendanceSheetNotesRelations = relations(attendanceSheetNotes, ({ one }) => ({
  createdBy: one(users, {
    fields: [attendanceSheetNotes.createdById],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [attendanceSheetNotes.groupId],
    references: [groups.id],
  }),
  sheet: one(attendanceSheets, {
    fields: [attendanceSheetNotes.sheetId],
    references: [attendanceSheets.id],
  }),
}));
