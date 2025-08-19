import { relations } from "drizzle-orm";
import { pgTable, varchar, timestamp, uuid, decimal } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const diplomas = pgTable("diplomas", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  amountPerHour: decimal("amount_per_hour", {
    precision: 4,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const diplomasRelations = relations(diplomas, ({ many }) => ({
  users: many(users),
}));
