# Kill Tony Index — Ingestion Worker

The worker ingests Kill Tony episodes from YouTube and extracts performance data (contestant names, timestamps) using pattern matching on video transcripts.

## Pipeline Stages

1. **Episode Discovery** — Fetch videos from the Kill Tony YouTube channel
2. **Episode Filtering** — Filter to only Kill Tony episodes (skip clips, compilations)
3. **Timecoded Transcript Retrieval** — Pull captions that already include timestamps (VTT/SRT), with a fallback that preserves timing
4. **Performance Extraction** — Detect set starts from timecoded captions (heuristics + LLM disambiguation)
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

## How Performance Extraction Works (updated approach)

The worker relies on **timecoded transcripts** (captions with timestamps) to generate precise deep links.
Plain text transcripts without timing are not sufficient to produce consistent `?t=___s` links.

### Why the old transcript-only approach fails

KillTonyDB’s creator noted they used AI to automate episode analysis. To generate **exact** set-start
timestamps at scale, you must have a transcript with timing (or an equivalent alignment step). A model
can identify *who* spoke in a transcript, but cannot reliably infer *when* a moment happened without
time anchors.

### The most likely pipeline (and why it matches the data)

1) **Timed captions (VTT/SRT) from YouTube** *(most common)*
- Pull the video’s caption track, which contains start/end timestamps for every chunk.
- Scan for set-start cues (e.g., “your next comedian…”, “put your hands together for…”).
- Map the detected caption timestamp → seconds → `?t=___s`.

Why this fits:
- Produces exact second-level links like KillTonyDB uses.
- Scales across the catalog.
- Stays consistent across episodes with similar structure.

2) **Chapters/timestamps in the YouTube description** *(sometimes available)*
- Parse description timestamps with regex.
- Map chapter lines to performers.
- Use those timestamps directly.

3) **Community timestamp sources + AI cleanup**
- Scrape an existing timestamp index.
- Normalize names, dedupe entries, and generate summaries via AI.

### What the pipeline is probably *not* doing
- **Not** deriving timestamps from a plain-text transcript (no time anchors).
- **Not** using the YouTube Data API to pull captions for arbitrary videos (restricted unless you own the content).

### Stage 1: Heuristic candidate finder

Scan the timecoded text for patterns that indicate a new set:

- "give it up for [name]"
- "please welcome [name]"
- "welcome to the stage [name]"
- "from the bucket [name]"
- "your next comedian [name]"
- etc.

Also scan for:
- “bucket pull #”
- “make some noise for”
- Known lineup names, if already available

### Stage 2: LLM disambiguation + best timestamp selection

For each candidate, pass a small caption window (±30s) to the model and ask it to:
- Confirm this is a set start (not a later callback).
- Identify the performer being introduced.
- Choose the best start timestamp (intro moment vs. first joke).

### Why this matters for Kill Tony

The “start of set” isn’t always the first word a comedian says:
- There’s often an intro and crowd noise.
- Tony might talk about them before they speak.
- KillTonyDB’s links look keyed to the **intro moment**, not necessarily the first line of the set.

## Troubleshooting

**No videos found:**
- Check `YOUTUBE_API_KEY` is valid
- Check `YOUTUBE_CHANNEL_ID` is correct (Kill Tony: `UCwzCMiicL-hBUzyjWiJaseg`)

**No transcripts:**
- Some videos may not have auto-generated captions
- The transcript service may be rate limiting requests
- Enable the fallback transcription service to generate timecoded segments from audio

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
