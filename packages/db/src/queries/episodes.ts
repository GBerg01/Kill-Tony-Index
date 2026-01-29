import type { Pool } from "pg";

import type { Episode } from "@killtony/shared/src/types";

export const listEpisodes = async (pool: Pool): Promise<Episode[]> => {
  const result = await pool.query(
    `SELECT id,
            youtube_id AS "youtubeId",
            title,
            published_at AS "publishedAt",
            duration_seconds AS "durationSeconds",
            youtube_url AS "youtubeUrl"
     FROM episodes
     ORDER BY published_at DESC NULLS LAST`
  );

  return result.rows as Episode[];
};

export const getEpisodeById = async (pool: Pool, id: string): Promise<Episode | null> => {
  const result = await pool.query(
    `SELECT id,
            youtube_id AS "youtubeId",
            title,
            published_at AS "publishedAt",
            duration_seconds AS "durationSeconds",
            youtube_url AS "youtubeUrl"
     FROM episodes
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

export type PerformanceWithContestant = {
  id: string;
  episodeId: string;
  contestantId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

export const getPerformancesByEpisodeId = async (
  pool: Pool,
  episodeId: string
): Promise<PerformanceWithContestant[]> => {
  const result = await pool.query(
    `SELECT p.id,
            p.episode_id AS "episodeId",
            p.contestant_id AS "contestantId",
            c.display_name AS "contestantName",
            p.start_seconds AS "startSeconds",
            p.end_seconds AS "endSeconds",
            p.confidence,
            p.intro_snippet AS "introSnippet"
     FROM performances p
     JOIN contestants c ON c.id = p.contestant_id
     WHERE p.episode_id = $1
     ORDER BY p.start_seconds ASC`,
    [episodeId]
  );

  return result.rows as PerformanceWithContestant[];
};
