import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL environment variable is not set");
}

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [adminClient()],
});

export const { signIn, signUp, useSession } = createAuthClient();
