import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "@/lib/db";
import { Role } from "@/types/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      accountNumber: {
        type: "string",
        required: false,
      },
      ssn: {
        type: "string",
        required: false,
      },
      diplomaId: {
        type: "string",
        required: false,
        references: {
          model: "diplomas",
          field: "id",
          onDelete: "restrict",
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: Role.TEACHER,
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
