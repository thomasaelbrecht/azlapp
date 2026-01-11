import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import env from "@/lib/env/server";

const pool = new Pool({
  connectionString: env.POSTGRES_URL,
});

export const db = drizzle(pool, { schema });
