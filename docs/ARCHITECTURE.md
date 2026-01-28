# Architecture Overview

## System goals
- Provide a searchable index of Kill Tony episodes, contestants, and performances.
- Offer deep links to YouTube timestamps for each performance.
- Support community ratings/comments with moderation.
- Maintain an ingestion pipeline for episode metadata and AI-assisted extraction.
- Keep contracts between frontend, backend, and worker explicit via shared types.

## Monorepo layout
- `apps/web`: Next.js frontend (public site + admin review UI).
- `apps/worker`: background ingestion pipeline (scraping, AI extraction, review queue tasks).
- `packages/db`: database schema, migrations, and database client.
- `packages/shared`: shared types/constants used across frontend and backend.

## Recommended tech stack (cost-aware)
- **Frontend:** Next.js (App Router) with React and TypeScript, hosted on Vercel or Cloudflare Pages.
- **Backend/API:** Next.js Route Handlers for public read APIs and authenticated write APIs to keep infra simple.
- **Database:** Postgres (Neon or Supabase) for reliability and free/low-cost tiers.
- **ORM/migrations:** Prisma for schema + migrations with generated TypeScript types.
- **Worker:** Node.js job runner (e.g., a lightweight cron on a small VM or managed scheduler) writing via `packages/db`.
- **Caching/search:** Start with Postgres full-text search; add Redis or hosted search later if needed.

## API layer clarification
In this project, the “API layer” is the set of HTTP endpoints the frontend calls for data. We can host
those endpoints inside Next.js using Route Handlers (so the API lives alongside the UI), which avoids
running a separate backend service until scale demands it.

## Frontend plan (UI structure & routing)
| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | Home + search | Primary search entry; trending performances.
| `/episodes` | Episode list | Filter by date, guests, title.
| `/episodes/[id]` | Episode detail | Metadata + performance list.
| `/contestants` | Contestant list | Alphabetical + search.
| `/contestants/[id]` | Contestant detail | Bio, aliases, appearances.
| `/performances/[id]` | Performance detail | Timestamp link, ratings, comments.
| `/leaderboards` | Top performances/contestants | Time-range filters.
| `/admin/review` | Admin queue | Approve or edit AI-extracted items.

## Backend plan (API boundaries & data flow)
### API boundaries
- **Public read APIs** (used by `apps/web`): episodes, contestants, performances, leaderboards, comments, ratings.
- **Authenticated user APIs**: submit ratings, comments, and edits to profiles (future).
- **Admin APIs**: review queue operations, content moderation, manual corrections.
- **Ingestion APIs/services** (used by `apps/worker`): create/update episodes, guests, contestants, and performances based on ingestion output.

### Service boundaries
- `apps/web` consumes a typed API client and renders UI routes described above.
- `apps/worker` performs ingestion and only writes through the database package/service layer.
- `packages/db` is the single source of truth for schema, migrations, and query helpers.
- `packages/shared` houses shared enums/types for API payloads, avoiding duplicated contract logic.

### Data flow
1. **Ingestion** pulls raw episode metadata (YouTube, guest info) and produces extracted performance segments.
2. **Worker** writes normalized data into the database (episodes, contestants, performances).
3. **Web UI** reads via API routes or service layer for listing and detail pages.
4. **Admin review** UI pulls pending items from the review queue and writes approvals/edits back to the DB.

## Shared contracts
- `packages/shared` holds TypeScript types for API payloads and shared enums.
- `packages/db` exports typed models + query helpers to avoid duplicating SQL logic.

## Operational considerations
- Rate-limit ingestion to comply with upstream sources.
- Track ingestion provenance and confidence scores.
- Version API responses to protect the web UI from breaking changes.
- Document authentication/authorization once the identity provider is chosen.
