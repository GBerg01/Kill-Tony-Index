# Kill Tony Index — Ingestion Worker

The worker ingests Kill Tony episodes from YouTube and extracts performance data (contestant names, timestamps) using pattern matching on video transcripts.

## Pipeline Stages

1. **Episode Discovery** — Fetch videos from the Kill Tony YouTube channel
2. **Episode Filtering** — Filter to only Kill Tony episodes (skip clips, compilations)
3. **Transcript Retrieval** — Fetch auto-generated captions from YouTube (optional fallback service)
4. **Performance Extraction** — Pattern match contestant intros in transcripts
5. **Confidence Scoring** — Score extractions based on pattern quality
6. **Database Persistence** — Upsert episodes, contestants, and performances

## Setup

1. Copy `.env.example` to `.env` in the project root
2. Set required environment variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kill_tony_index
   YOUTUBE_API_KEY=your-youtube-api-key
   YOUTUBE_CHANNEL_ID=UCwzCMiicL-hBUzyjWiJaseg
   ```
3. (Optional) Enable a fallback transcription service when captions are disabled:
   ```
   TRANSCRIPT_FALLBACK_ENABLED=true
   TRANSCRIPT_FALLBACK_URL=https://your-transcriber.example.com/transcripts
   TRANSCRIPT_FALLBACK_API_KEY=your-service-api-key
   TRANSCRIPT_FALLBACK_MAX_DURATION_SECONDS=10800
   ```
4. Start the database: `docker-compose up -d`
5. Run migrations: `cd packages/db && npm run prisma:migrate`

## Usage

```bash
cd apps/worker

# Fetch 50 most recent videos (default)
npm run dev

# Fetch more videos
npm run dev -- --max=100

# Fetch ALL videos (initial database population)
npm run dev -- --full

# Dry run - test extraction without writing to database
npm run dev -- --dry-run

# Show help
npm run dev -- --help
```

## CLI Options

| Option | Description |
|--------|-------------|
| `--full`, `-f` | Fetch ALL videos from channel (for initial population) |
| `--dry-run`, `-d` | Test extraction without persisting to database |
| `--max=N` | Maximum videos to fetch (default: 50) |
| `--help`, `-h` | Show usage information |

## Output

The worker logs progress and a summary:

```
============================================================
Kill Tony Index Worker
============================================================
Mode: recent
Max videos: 50

Step 1/4: Fetching videos from YouTube...
Fetched page 1: 50 videos (total: 50)
...

============================================================
EXTRACTION SUMMARY
============================================================
Episodes: 45
Performances: 312
Unique contestants: 287
```

## How Performance Extraction Works

The worker looks for common Kill Tony intro patterns in transcripts:

- "give it up for [name]"
- "please welcome [name]"
- "welcome to the stage [name]"
- "from the bucket [name]"
- "your next comedian [name]"
- etc.

Each extraction gets a confidence score (0.0-1.0) based on:
- Pattern match strength
- Name format (multi-word names score higher)
- Context length

## Troubleshooting

**No videos found:**
- Check `YOUTUBE_API_KEY` is valid
- Check `YOUTUBE_CHANNEL_ID` is correct (Kill Tony: `UCwzCMiicL-hBUzyjWiJaseg`)

**No transcripts:**
- Some videos may not have auto-generated captions
- The transcript service may be rate limiting requests
- Enable the fallback transcription service to generate timestamps from audio

**Few performances extracted:**
- Transcripts may not capture intro phrases accurately
- Check logs for which videos have transcripts

## Development

```bash
# Generate Prisma client (after schema changes)
cd packages/db && npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```
