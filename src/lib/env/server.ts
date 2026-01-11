import "server-only";

import { logger } from "better-auth";
import z from "zod";

const envSchema = z.object({
  // ========================================
  // General
  // ========================================
  BASE_URL: z.url({ message: "BASE_URL must be a valid URL" }),
  NODE_ENV: z.string().min(1, { message: "NODE_ENV cannot be empty" }),

  // ========================================
  // Databases
  // ========================================
  POSTGRES_URL: z.url({ message: "POSTGRES_URL must be a valid URL" }),
});

// Lazy validation: only parse env vars when actually accessed, not at build time
let cachedEnv: z.infer<typeof envSchema> | null = null;

function getServerEnv() {
  if (cachedEnv === null) {
    logger.info("Validating server environment variables...");

    // Skip validation during build phase - env vars are only needed at runtime
    const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

    if (isBuildTime) {
      // Return empty object during build - validation will happen at runtime
      cachedEnv = {} as z.infer<typeof envSchema>;
    } else {
      // At runtime, validate all env vars
      cachedEnv = envSchema.parse(process.env);
    }
  }
  return cachedEnv;
}

// Export a Proxy that defers validation until properties are accessed at runtime
export default new Proxy({} as z.infer<typeof envSchema>, {
  get(_, prop) {
    const env = getServerEnv();
    return env[prop as keyof typeof env];
  },
});
