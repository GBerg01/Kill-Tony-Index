import type { Pool } from "pg";

import type { Performance } from "@killtony/shared/src/types";

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

export const listPerformances = async (
  pool: Pool,
  pagination?: PaginationParams
): Promise<PaginatedResult<Performance>> => {
  const limit = pagination?.limit || 20;
  const offset = pagination?.offset || 0;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id,
              episode_id AS "episodeId",
              contestant_id AS "contestantId",
              start_seconds AS "startSeconds",
              end_seconds AS "endSeconds",
              confidence,
              intro_snippet AS "introSnippet"
       FROM performances
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    pool.query(`SELECT COUNT(*) FROM performances`),
  ]);

  return {
    items: dataResult.rows as Performance[],
    total: parseInt(countResult.rows[0].count, 10),
    limit,
    offset,
  };
};

export type PerformanceDetail = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  episodePublishedAt: string;
  youtubeUrl: string;
  contestantId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

export const getPerformanceById = async (pool: Pool, id: string): Promise<PerformanceDetail | null> => {
  const result = await pool.query(
    `SELECT p.id,
            p.episode_id AS "episodeId",
            e.title AS "episodeTitle",
            e.published_at AS "episodePublishedAt",
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
     WHERE p.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};
