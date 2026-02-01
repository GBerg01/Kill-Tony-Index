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

export type PerformanceListItem = {
  id: string;
  contestantId: string;
  contestantName: string;
  episodeId: string;
  episodeNumber: number | null;
  episodeTitle: string;
  episodeDate: string | null;
  youtubeUrl: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
  ratingAvg: number;
  ratingCount: number;
  commentCount: number;
};

export const listPerformancesWithDetails = async (
  pool: Pool,
  pagination?: PaginationParams
): Promise<PaginatedResult<PerformanceListItem>> => {
  const limit = pagination?.limit || 20;
  const offset = pagination?.offset || 0;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `WITH performance_stats AS (
         SELECT p.id AS performance_id,
                COALESCE(AVG(v.rating)::float, 0) AS rating_avg,
                COUNT(DISTINCT v.id)::int AS rating_count,
                COUNT(DISTINCT cm.id)::int AS comment_count
         FROM performances p
         LEFT JOIN votes v ON v.performance_id = p.id
         LEFT JOIN comments cm ON cm.performance_id = p.id
         GROUP BY p.id
       )
       SELECT p.id,
              p.contestant_id AS "contestantId",
              c.display_name AS "contestantName",
              p.episode_id AS "episodeId",
              e.episode_number AS "episodeNumber",
              e.title AS "episodeTitle",
              e.published_at AS "episodeDate",
              e.youtube_url AS "youtubeUrl",
              p.start_seconds AS "startSeconds",
              p.end_seconds AS "endSeconds",
              p.confidence::float AS confidence,
              p.intro_snippet AS "introSnippet",
              ps.rating_avg AS "ratingAvg",
              ps.rating_count AS "ratingCount",
              ps.comment_count AS "commentCount"
       FROM performances p
       JOIN contestants c ON c.id = p.contestant_id
       JOIN episodes e ON e.id = p.episode_id
       LEFT JOIN performance_stats ps ON ps.performance_id = p.id
       ORDER BY e.published_at DESC NULLS LAST, p.start_seconds ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    pool.query(`SELECT COUNT(*) FROM performances`),
  ]);

  return {
    items: dataResult.rows as PerformanceListItem[],
    total: parseInt(countResult.rows[0].count, 10),
    limit,
    offset,
  };
};

export type TrendingPerformance = PerformanceListItem & {
  recentVoteCount: number;
};

export const listTrendingPerformances = async (
  pool: Pool,
  limit: number = 6
): Promise<TrendingPerformance[]> => {
  const result = await pool.query(
    `WITH recent_votes AS (
       SELECT performance_id,
              COUNT(*)::int AS recent_vote_count
       FROM votes
       WHERE created_at > NOW() - INTERVAL '7 days'
       GROUP BY performance_id
     ),
     performance_stats AS (
       SELECT p.id AS performance_id,
              COALESCE(AVG(v.rating)::float, 0) AS rating_avg,
              COUNT(DISTINCT v.id)::int AS rating_count,
              COUNT(DISTINCT cm.id)::int AS comment_count
       FROM performances p
       LEFT JOIN votes v ON v.performance_id = p.id
       LEFT JOIN comments cm ON cm.performance_id = p.id
       GROUP BY p.id
     )
     SELECT p.id,
            p.contestant_id AS "contestantId",
            c.display_name AS "contestantName",
            p.episode_id AS "episodeId",
            e.episode_number AS "episodeNumber",
            e.title AS "episodeTitle",
            e.published_at AS "episodeDate",
            e.youtube_url AS "youtubeUrl",
            p.start_seconds AS "startSeconds",
            p.end_seconds AS "endSeconds",
            p.confidence::float AS confidence,
            p.intro_snippet AS "introSnippet",
            ps.rating_avg AS "ratingAvg",
            ps.rating_count AS "ratingCount",
            ps.comment_count AS "commentCount",
            COALESCE(rv.recent_vote_count, 0) AS "recentVoteCount"
     FROM performances p
     JOIN contestants c ON c.id = p.contestant_id
     JOIN episodes e ON e.id = p.episode_id
     LEFT JOIN performance_stats ps ON ps.performance_id = p.id
     LEFT JOIN recent_votes rv ON rv.performance_id = p.id
     ORDER BY ps.rating_avg DESC, rv.recent_vote_count DESC NULLS LAST, ps.rating_count DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows as TrendingPerformance[];
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
