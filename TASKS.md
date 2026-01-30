# Kill Tony Index — Task Tracker

> Source of truth for project progress. Update after every work session.

## Current Phase: 5 — Worker Improvements & Data Population

## In Progress
<!-- If stopping mid-task, describe exactly where you left off -->

### Worker Improvements (2026-01-30)
The worker pipeline has been significantly enhanced to be production-ready:
- [x] Added pagination to fetch ALL videos (700+) from the channel
- [x] Added episode number extraction from video titles
- [x] Expanded performance extraction patterns (13 patterns vs original 4)
- [x] Fixed NAME_REGEX to handle single names, ALL CAPS, and edge cases
- [x] Added retry logic with exponential backoff for transcript fetching
- [x] Added concurrency control to avoid rate limiting
- [x] Added CLI arguments: `--full`, `--dry-run`, `--max=N`
- [x] Added `episodeNumber` field to Episode schema
- [x] Episode filtering to skip clips/compilations

**Next Steps:**
1. Get a valid YOUTUBE_API_KEY and run the worker to populate the database
2. Wire up UI pages to use database API routes instead of mock data
3. Test the full data flow end-to-end

## Up Next
## Phase 2 — Search
- [x] 2.1 Add search API endpoint with Postgres full-text search
- [x] 2.2 Build search UI component for homepage
- [x] 2.3 Include contestant aliases in search

## Phase 3 — Worker Pipeline
- [x] 3.1 Fix YouTube duration fetching (currently always 0)
- [x] 3.2 Add YouTube transcript/captions fetching
- [x] 3.3 Build performance boundary detection
- [x] 3.4 Build contestant name extraction from transcripts
- [x] 3.5 Add confidence scoring for extractions
- [x] 3.6 Build admin review queue UI

## Phase 4 — Community Features
- [x] 4.1 Add authentication (NextAuth)
- [x] 4.2 Build rating system (1-10 per user per performance)
- [x] 4.3 Build comments with moderation
- [x] 4.4 Build leaderboards page

## Backlog (Bugs & Tech Debt)
- [x] Add `pnpm-workspace.yaml` file
- [x] Configure tsconfig path aliases in web app
- [x] Add Prisma generated client to `.gitignore`
- [x] Add error boundaries to React pages
- [x] Add loading states to all pages

## Done
- [x] (2025-02-14) Initial schema, API routes, worker stub, documentation
- [x] (2026-01-29) 1.1 Build home page with episode list grid — Added layout.tsx, updated page.tsx with episode grid, created /episodes listing page
- [x] (2026-01-29) 1.2 Build episode detail page — Created `/episodes/[id]` page with performances list, YouTube timestamp links, and `/api/episodes/[id]` route
- [x] (2026-01-29) 1.3 Build contestant detail page — Created `/contestants/[id]` page with appearances, `/contestants` listing, `/api/contestants/[id]` route, added ContestantDetail type with social links
- [x] (2026-01-29) 1.4 & 1.6 Build performance detail page — Created `/performances/[id]` page with episode/contestant links, YouTube timestamp, confidence score, and `/api/performances/[id]` route
- [x] (2026-01-29) 1.5 Add pagination — All list APIs now support `?page=1&limit=20`, return pagination metadata (page, limit, total, totalPages), max limit 100
- [x] (2026-01-29) 2.1 Add search API endpoint with Postgres full-text search
- [x] (2026-01-29) 2.2 Build search UI component for homepage
- [x] (2026-01-29) 2.3 Include contestant aliases in search
- [x] (2026-01-29) 3.1 Fix YouTube duration fetching (currently always 0)
- [x] (2026-01-29) 3.2 Add YouTube transcript/captions fetching
- [x] (2026-01-29) 3.3 Build performance boundary detection
- [x] (2026-01-29) 3.4 Build contestant name extraction from transcripts
- [x] (2026-01-29) 3.5 Add confidence scoring for extractions
- [x] (2026-01-29) 3.6 Build admin review queue UI
- [x] (2026-01-29) 4.2 Build rating system (1-10 per user per performance)
- [x] (2026-01-29) 4.3 Build comments with moderation
- [x] (2026-01-29) 4.4 Build leaderboards page
