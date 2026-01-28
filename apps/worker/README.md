# Ingestion worker

The worker ingests Kill Tony episodes and extracts performance data using an AI pipeline.

Stages:

1. Episode discovery (YouTube playlist/channel scan)
2. Transcript retrieval (YouTube captions or Whisper)
3. Performance boundary detection
4. Name extraction + identity resolution
5. Confidence gating + auto-publish
6. Admin review queue for low-confidence items

The worker will write episodes, contestants, and performances into the database and attach raw transcript snippets for auditing.

## Local development

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `YOUTUBE_API_KEY`, and `YOUTUBE_CHANNEL_ID`.
2. Run `pnpm --filter @killtony/worker dev` to execute the ingestion stub.
