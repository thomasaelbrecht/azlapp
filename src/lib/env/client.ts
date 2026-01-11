"use client";

import z from "zod";

const envSchema = z.object({
  // ========================================
  // General
  // ========================================
  NEXT_PUBLIC_BASE_URL: z.url({ message: "NEXT_PUBLIC_BASE_URL must be a valid URL" }),
});

export default envSchema.parse({
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
});
