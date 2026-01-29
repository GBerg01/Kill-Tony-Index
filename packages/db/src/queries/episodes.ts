import type { Pool } from "pg";

import type { Episode } from "@killtony/shared/src/types";

export type PaginationParams = {
  limit?: number;
  offset?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export const listEpisodes = async (
  pool: Pool,
  pagination?: PaginationParams
): Promise<PaginatedResult<Episode>> => {
  const limit = pagination?.limit || 20;
  const offset = pagination?.offset || 0;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id,
              youtube_id AS "youtubeId",
              title,
              published_at AS "publishedAt",
              duration_seconds AS "durationSeconds",
              youtube_url AS "youtubeUrl"
       FROM episodes
       ORDER BY published_at DESC NULLS LAST
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    pool.query(`SELECT COUNT(*) FROM episodes`),
  ]);

  return {
    items: dataResult.rows as Episode[],
    total: parseInt(countResult.rows[0].count, 10),
    limit,
    offset,
  };
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
