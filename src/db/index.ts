import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import env from "@/lib/env/server";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: env.POSTGRES_URL,
  ssl: env.NODE_ENV !== "production" ? false : { rejectUnauthorized: false },
});

export const db = drizzle({ client: pool, schema, logger: false });

// Transaction type for use with Drizzle ORM operations
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

if (env.POSTGRES_URL && env.NODE_ENV === "production") {
  (async () => {
    await migrate(db, { migrationsFolder: "./migrations" });
  })();
}
