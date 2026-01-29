# Kill Tony Index — Task Tracker

> Source of truth for project progress. Update after every work session.

## Current Phase: 3 — Worker Pipeline

## In Progress
<!-- If stopping mid-task, describe exactly where you left off -->

## Up Next
## Phase 3 — Worker Pipeline
- [ ] 3.6 Build admin review queue UI

## Phase 4 — Community Features
- [ ] 4.1 Add authentication (NextAuth)
- [ ] 4.2 Build rating system (1-10 per user per performance)
- [ ] 4.3 Build comments with moderation
- [ ] 4.4 Build leaderboards page

## Backlog (Bugs & Tech Debt)
- [ ] Add `pnpm-workspace.yaml` file
- [ ] Configure tsconfig path aliases in web app
- [ ] Add Prisma generated client to `.gitignore`
- [ ] Add error boundaries to React pages
- [ ] Add loading states to all pages

## Done
- [x] (2025-02-14) Initial schema, API routes, worker stub, documentation
- [x] (2026-01-29) 1.1 Build home page with episode list grid — Added layout.tsx, updated page.tsx with episode grid, created /episodes listing page
- [x] (2026-01-29) 1.2 Build episode detail page — Created `/episodes/[id]` page with performances list, YouTube timestamp links, and `/api/episodes/[id]` route
- [x] (2026-01-29) 1.3 Build contestant detail page — Created `/contestants/[id]` page with appearances, `/contestants` listing, `/api/contestants/[id]` route, added ContestantDetail type with social links
- [x] (2026-01-29) 1.4 & 1.6 Build performance detail page — Created `/performances/[id]` page with episode/contestant links, YouTube timestamp, confidence score, and `/api/performances/[id]` route
- [x] (2026-01-29) 1.5 Add pagination — All list APIs now support `?page=1&limit=20`, return pagination metadata (page, limit, total, totalPages), max limit 100
- [x] (2026-01-29) 2.1-2.3 Search — Added `/api/search` with Postgres full-text search, SearchBar component on homepage, searches episodes + contestants (including aliases)
- [x] (2026-01-29) 3.1-3.5 Worker Pipeline — Fixed YouTube duration (Videos API), added transcript fetching, performance boundary detection with intro pattern matching, contestant name extraction, confidence scoring (0.5-0.95 based on pattern quality)
