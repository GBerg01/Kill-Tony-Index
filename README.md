# Kill Tony Index

Kill Tony Index is a searchable archive of Kill Tony contestants and performances with deep links to YouTube timestamps. The repository is organized as a monorepo with separate apps for the web experience and ingestion pipeline, plus shared packages for database and types.

## Monorepo layout

```
kill-tony-index/
  apps/
    web/        # Next.js frontend
    worker/     # ingestion pipeline workers
  packages/
    db/         # schema and DB client
    shared/     # shared types/constants
```

## Product requirements (MVP)

- Index episodes and metadata (title, publish date, duration, guests, YouTube link).
- Maintain contestant profiles with aliases and external links.
- Store performances (contestant + episode + timestamp) with confidence and transcript snippet.
- Allow logged-in users to rate performances 1–10 with a per-user vote.
- Provide leaderboards for top performances and contestants.
- Allow comments per performance with basic moderation.
- Provide host/guest pages with episode lists.

## Data model (high level)

The core unit is a performance, which links a contestant to an episode and includes a YouTube timestamp. Performances are backed by AI extraction and can be reviewed in an admin queue.

## Documentation

- `docs/ARCHITECTURE.md`: system overview, routing plan, and API boundaries.
- `docs/SCHEMA.md`: entity definitions and frontend data contract stubs.
- `docs/PROJECT_LOG.md`: decision log and project scaffolding notes.

## Next steps

- Implement the database schema in `packages/db`.
- Build API routes for episodes, contestants, performances, votes, and comments.
- Build the web UI for search, listings, and detail pages.
- Build the worker pipeline for ingestion and review queue.

## Getting started

This repo is currently scaffolded for the MVP. Each app/package contains a README with its responsibilities and planned implementation steps.
