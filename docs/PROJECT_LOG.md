# Project Log

## Chapter 1: Project Foundations & Documentation

### Decisions (2025-02-14)
- **Architecture:** Maintain a monorepo with `apps/web` (Next.js UI), `apps/worker` (ingestion/background jobs), and shared packages (`packages/db`, `packages/shared`).
- **Documentation:** Capture architecture, data contracts, and schema notes in `docs/ARCHITECTURE.md` and `docs/SCHEMA.md` to keep product requirements adjacent to implementation.
- **UI structure:** Plan pages for home/search, episodes, contestants, performances, leaderboards, and admin review to cover MVP flows.
- **API boundaries:** Separate read APIs for the web UI from ingestion/admin write APIs, with shared types to keep contracts stable.
- **Data flow:** Ingestion pipeline writes to the database; web UI reads via API routes or a dedicated service layer; admin queue uses the same service layer with elevated permissions.
- **Stack direction:** Use Next.js for the web UI and API routes, Postgres as the primary datastore, and Prisma for schema/migrations to keep cost low while staying reliable.

### Decision template
- **Decision:** <short description>
- **Context:** <why now / what problem>
- **Options considered:** <list>
- **Outcome:** <what we chose>
- **Follow-ups:** <next steps>

### Risks / Follow-ups
- Confirm authentication strategy for user ratings/comments and admin review flows.
- Decide hosting and deployment targets for web + worker.

## Chapter 2: Database Design & Backend Core

### Progress (2025-02-14)
- Added initial SQL migration and seed data in `packages/db` for local development.
- Documented migration + seed locations in the database package README.
- Added a Prisma schema mirror in `packages/db/prisma` for ORM workflows.
- Added a minimal Next.js app scaffold with API routes backed by mock data.
- Added shared API response types in `packages/shared` for consistent payloads.
- Added a database client + query helpers in `packages/db`, and wired API routes to use them when `DATABASE_URL` is set.
- Added shared connection pooling and API error handling fallbacks.
- Added shared API error shape to standardize error payloads.
- Added API error codes + shared logger helper for debugging.

### Next steps
- Decide on Prisma vs. raw SQL workflow for production migrations.
- Add centralized logging strategy (structured logs + redaction).
