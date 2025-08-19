import { pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";

export const mailTemplates = pgTable("mail_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sentMails = pgTable("sent_mails", {
  id: uuid("id").primaryKey().defaultRandom(),
  sentById: uuid("sent_by_id")
    .references(() => users.id)
    .notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sentMailsRelations = relations(sentMails, ({ one }) => ({
  sentBy: one(users, {
    fields: [sentMails.sentById],
    references: [users.id],
  }),
}));
