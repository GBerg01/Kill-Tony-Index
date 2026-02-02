# Local Setup, Testing & Worker Flow Validation

This guide turns the project setup into a repeatable checklist you can use to validate the worker end-to-end on your machine.

## 1) Prerequisites

Install the following if you do not already have them:

- **Node.js v18+** (`node --version`, `npm --version`)
- **Git** (`git --version`)
- **Docker Desktop** (`docker --version`, `docker-compose --version`)

## 2) Clone & Install Dependencies

```bash
# clone the repo
cd ~/Desktop

git clone https://github.com/YOUR_USERNAME/kill-tony-index.git
cd kill-tony-index

# install dependencies
npm install
```

## 3) Start the Database (Docker)

```bash
docker-compose up -d
```

Validate it is running:

```bash
docker ps
```

## 4) Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and set:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kill_tony_index
YOUTUBE_API_KEY=your_actual_key_here
YOUTUBE_CHANNEL_ID=UCMlPBHEjuJ_y1forJXDnfmQ
```

> You can generate a YouTube API key in Google Cloud Console under **APIs & Services → Credentials**.

## 5) Generate Prisma Client & Run Migrations

```bash
cd packages/db
npm run prisma:generate
npm run prisma:migrate
cd ../..
```

## 6) Worker Flow Validation (Dry Run → Small Batch → Full)

Start in **dry-run mode** to confirm the ingestion pipeline without writing to the database:

```bash
cd apps/worker
npm run dev -- --dry-run --max=5
```

If the dry run looks good, try a **small real batch**:

```bash
npm run dev -- --max=20
```

When you are confident, run the **full import**:

```bash
npm run dev -- --full
```

### Expected output signals

- You should see logs about fetching videos, transcripts, and extracted performances.
- Errors about the YouTube API usually indicate the API key or channel ID is missing/invalid.

## 7) Verify Data Was Written

**Option A: Web app**

```bash
cd apps/web
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to confirm data appears.

**Option B: Prisma Studio**

```bash
cd packages/db
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555) and check tables.

**Option C: Direct SQL query**

```bash
docker exec -it $(docker ps -q --filter ancestor=postgres:15) psql -U postgres -d kill_tony_index
```

```sql
SELECT COUNT(*) FROM episodes;
SELECT COUNT(*) FROM contestants;
SELECT COUNT(*) FROM performances;
```

## 8) Common Issues

- **`docker-compose: command not found`** → ensure Docker Desktop is installed and running (try `docker compose` without the hyphen).
- **`ECONNREFUSED 127.0.0.1:5432`** → database is not running; start it with `docker-compose up -d`.
- **403/Invalid API key** → re-check `YOUTUBE_API_KEY` in `.env`.
- **Worker finds zero performances** → some transcripts are sparse; check logs and consider increasing the batch size.

## 9) Shutdown

```bash
# stop web app (if running)
Ctrl + C

# stop database (optional)
docker-compose down
```
