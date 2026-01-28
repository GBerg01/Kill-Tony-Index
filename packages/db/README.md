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

## Seed data
- `seed.sql` provides a small dataset for local development.
