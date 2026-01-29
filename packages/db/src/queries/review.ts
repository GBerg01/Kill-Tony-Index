import type { Pool } from "pg";

export type ReviewQueueItem = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  youtubeUrl: string;
  contestantId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

export type ReviewQueueParams = {
  limit?: number;
  confidenceThreshold?: number;
};

export const listReviewQueue = async (
  pool: Pool,
  params?: ReviewQueueParams
): Promise<ReviewQueueItem[]> => {
  const limit = params?.limit ?? 25;
  const confidenceThreshold = params?.confidenceThreshold ?? 0.7;

  const result = await pool.query(
    `SELECT p.id,
            p.episode_id AS "episodeId",
            e.title AS "episodeTitle",
            e.youtube_url AS "youtubeUrl",
            p.contestant_id AS "contestantId",
            c.display_name AS "contestantName",
            p.start_seconds AS "startSeconds",
            p.end_seconds AS "endSeconds",
            p.confidence,
            p.intro_snippet AS "introSnippet"
     FROM performances p
     JOIN episodes e ON e.id = p.episode_id
     JOIN contestants c ON c.id = p.contestant_id
     WHERE p.confidence < $1
     ORDER BY p.confidence ASC, p.created_at DESC
     LIMIT $2`,
    [confidenceThreshold, limit]
  );

  return result.rows as ReviewQueueItem[];
};
