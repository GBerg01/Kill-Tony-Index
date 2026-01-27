# Architecture Overview

## System goals
- Provide a searchable index of Kill Tony episodes, contestants, and performances.
- Offer deep links to YouTube timestamps for each performance.
- Support community ratings/comments with moderation.
- Maintain an ingestion pipeline for episode metadata and AI-assisted extraction.

## Monorepo layout
- `apps/web`: Next.js frontend (public site + admin review UI).
- `apps/worker`: background ingestion pipeline (scraping, AI extraction, review queue tasks).
- `packages/db`: database schema, migrations, and database client.
- `packages/shared`: shared types/constants used across frontend and backend.

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
