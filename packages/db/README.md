# Database package

This package contains the SQL schema, migrations, and database client setup.

Key entities:

- users
- episodes
- contestants
- contestant_aliases
- performances
- votes
- comments
- guests
- episode_guests

The schema includes timestamps, confidence scores, transcript snippets, and rating aggregates to support leaderboards.

## Migrations
- `migrations/001_init.sql` contains the initial schema.
- `schema.sql` mirrors the current schema for quick reference.
- `prisma/schema.prisma` mirrors the SQL schema for ORM-based workflows.
- Prisma is the canonical migration tool for ongoing schema changes.

## Seed data
- `seed.sql` provides a small dataset for local development.

## Query helpers
- `src` contains the database client and list queries used by API routes.
- The client uses a shared connection pool per process.
- Prisma access is exposed via `getPrismaClient` for ingestion workflows.

## Prisma setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Run `pnpm --filter @killtony/db prisma:migrate` to create the schema.
