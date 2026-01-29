# CLAUDE.md

This file provides context for Claude Code when working on the Kill Tony Index project.

## Project Overview

Kill Tony Index is a searchable archive of Kill Tony podcast contestants and performances with deep links to YouTube timestamps. Users can rate performances (1-10), leave comments, and browse leaderboards.

## Monorepo Structure

```
kill-tony-index/
├── apps/
│   ├── web/           # Next.js 14 frontend (App Router)
│   └── worker/        # Ingestion pipeline for episode/performance extraction
├── packages/
│   ├── db/            # Prisma schema, migrations, and database client
│   └── shared/        # Shared TypeScript types and constants
├── docs/              # Architecture and schema documentation
└── docker-compose.yml # Local Postgres database
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Database**: PostgreSQL 15 (via Docker locally)
- **ORM**: Prisma 5.12
- **Package Manager**: npm workspaces

## Development Setup

```bash
# Start local Postgres
docker-compose up -d

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma client
cd packages/db && npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start web app
cd apps/web && npm run dev
```

## Key Data Models (Prisma)

Located in `packages/db/prisma/schema.prisma`:

- **Episode**: YouTube episode with title, publish date, duration
- **Guest**: Notable guests on episodes (many-to-many with Episode via EpisodeGuest)
- **Contestant**: Comedians who perform, with social links and aliases
- **Performance**: Links Contestant to Episode with timestamp (startSeconds/endSeconds) and confidence score
- **Vote**: User rating (1-10) on a Performance (unique per user)
- **Comment**: User comments on performances with flagging support
- **User**: Basic user model with email and displayName

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string (default: `postgresql://postgres:postgres@localhost:5432/kill_tony_index`)
- `YOUTUBE_API_KEY` - For worker ingestion (optional for web dev)
- `YOUTUBE_CHANNEL_ID` - Kill Tony channel ID (optional for web dev)

## Common Commands

```bash
# Database
cd packages/db
npm run prisma:generate   # Regenerate Prisma client after schema changes
npm run prisma:migrate    # Run migrations in dev mode
npm run prisma:push       # Push schema to DB without migration

# Web app
cd apps/web
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server

# Worker
cd apps/worker
npm run dev    # Run ingestion pipeline
```

## API Routes

The web app uses Next.js Route Handlers for API endpoints:
- Public read APIs: episodes, contestants, performances, leaderboards
- Authenticated APIs: ratings, comments
- Admin APIs: review queue, moderation

## Code Conventions

- UUIDs for all entity IDs
- Timestamps in UTC ISO-8601
- Prisma model names use PascalCase; table names use snake_case (via `@@map`)
- Package imports use `@killtony/db` and `@killtony/shared` aliases

## Task Management

**TASKS.md** is the source of truth for project progress. Always:
1. Check `TASKS.md` before starting work
2. Update it after completing tasks
3. Note stopping points if leaving work incomplete

## Documentation

- `TASKS.md` - Current task tracker (check first!)
- `docs/ARCHITECTURE.md` - System design, routing, API boundaries
- `docs/SCHEMA.md` - Entity definitions and TypeScript contracts
- `docs/PROJECT_LOG.md` - Decision log and project notes
