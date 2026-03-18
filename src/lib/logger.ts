import pino, { type Logger } from "pino";
import env from "@/lib/env/server";

export const logger: Logger =
  env.NODE_ENV === "production"
    ? // JSON in production
      pino({ level: "info" })
    : // Pretty print in development
      pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });
