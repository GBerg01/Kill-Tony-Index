# Schema & Data Contracts

## Conventions
- IDs are UUIDs unless a natural key is explicitly documented.
- `created_at`/`updated_at` timestamps use UTC ISO-8601.
- `status` fields are enums to support moderation and review workflows.
- Primary datastore is Postgres.

## Core entities
### Episode
- `id`
- `title`
- `published_at`
- `duration_seconds`
- `youtube_url`
- `thumbnail_url`
- `description`
- `guests` (many-to-many)

### Guest
- `id`
- `name`
- `profile_url`

### Contestant
- `id`
- `name`
- `aliases`
- `bio`
- `social_links`

### Performance
- `id`
- `episode_id`
- `contestant_id`
- `start_timestamp`
- `end_timestamp`
- `confidence_score`
- `transcript_snippet`
- `status` (e.g., `pending_review`, `approved`)

### Rating
- `id`
- `performance_id`
- `user_id`
- `score` (1–10)
- `created_at`

### Comment
- `id`
- `performance_id`
- `user_id`
- `body`
- `status` (e.g., `visible`, `flagged`)
- `created_at`

### User
- `id`
- `display_name`
- `email`
- `role` (e.g., `user`, `admin`)

## Relationships
- Episode ↔ Guests: many-to-many.
- Episode → Performances: one-to-many.
- Contestant → Performances: one-to-many.
- Performance → Ratings: one-to-many (unique per user).
- Performance → Comments: one-to-many.

## Status enums (draft)
| Entity | Values | Notes |
| --- | --- | --- |
| Performance | `pending_review`, `approved`, `rejected` | Set by ingestion + admin review. |
| Comment | `visible`, `flagged`, `removed` | Supports moderation queues. |

## Planned indexes
- Episodes: `published_at`, `title` (search).
- Contestants: `name`, `aliases`.
- Performances: `episode_id`, `contestant_id`, `status`.
- Ratings: unique constraint on `(performance_id, user_id)`.
- Comments: `performance_id`, `status`.

## Frontend data contracts (stub)
### `EpisodeSummary`
```ts
export interface EpisodeSummary {
  id: string;
  title: string;
  episodeNumber?: number;
  publishedAt: string;
  durationSeconds: number;
  youtubeUrl: string;
  thumbnailUrl?: string;
  guestNames: string[];
}
```

### `ContestantSummary`
```ts
export interface ContestantSummary {
  id: string;
  name: string;
  aliases: string[];
  appearances: number;
}
```

### `PerformanceSummary`
```ts
export interface PerformanceSummary {
  id: string;
  episodeId: string;
  contestantId: string;
  startTimestamp: number;
  endTimestamp?: number;
  confidenceScore: number;
  transcriptSnippet?: string;
  averageRating?: number;
}
```

## Migration/seed expectations
- Seed initial episodes + guests from ingestion output.
- Seed a small set of contestants + performances for local development.
- Maintain a migration history in `packages/db`.
