import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Session } from "../types/auth";

type EnsureAuthenticatedOptions = { onFail: "redirect"; redirectTo?: string } | { onFail: "throw"; message?: string };

export async function ensureAuthenticated(options: EnsureAuthenticatedOptions): Promise<Session> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return session as Session;
  }

  if (options.onFail === "redirect") {
    redirect(options.redirectTo || "/login");
  }

  throw new Error(options.message || "Unauthorized");
}
