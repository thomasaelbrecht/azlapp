import { asc, isNull } from "drizzle-orm";
import { db } from "@/db";
import { groups } from "@/db/schema";

export async function getAllGroups(): Promise<{ id: string; name: string }[]> {
  return db
    .select({ id: groups.id, name: groups.name })
    .from(groups)
    .where(isNull(groups.deletedAt))
    .orderBy(asc(groups.name));
}
