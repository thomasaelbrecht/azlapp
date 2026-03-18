# azlapp

Next.js app with Better Auth authentication and Drizzle ORM.

## Tech Stack

- Next.js 16 + React 19
- TypeScript
- Drizzle ORM + PostgreSQL
- Better Auth
- Tailwind CSS
- Biome (lint/format)

## Key Commands

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm lint:fix` - Lint and fix
- `pnpm db:push` - Push database schema

## Best practices

- Prefer server actions over API routes for server logic
- Try to fetch data in server components when possible, use client components for interactivity
- Use Drizzle ORM for all database interactions
- Keep components focused and reusable
- Use Tailwind for styling, avoid custom CSS when possible
