import type { Pool } from "pg";

import type { Contestant, ContestantDetail } from "@killtony/shared/src/types";

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

export const listContestants = async (
  pool: Pool,
  pagination?: PaginationParams
): Promise<PaginatedResult<Contestant>> => {
  const limit = pagination?.limit || 20;
  const offset = pagination?.offset || 0;

  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT contestants.id,
              contestants.display_name AS "displayName",
              COALESCE(
                ARRAY_AGG(contestant_aliases.alias ORDER BY contestant_aliases.alias)
                  FILTER (WHERE contestant_aliases.alias IS NOT NULL),
                '{}'
              ) AS aliases
       FROM contestants
       LEFT JOIN contestant_aliases
         ON contestant_aliases.contestant_id = contestants.id
       GROUP BY contestants.id
       ORDER BY contestants.display_name ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    pool.query(`SELECT COUNT(*) FROM contestants`),
  ]);

  return {
    items: dataResult.rows as Contestant[],
    total: parseInt(countResult.rows[0].count, 10),
    limit,
    offset,
  };
};

export const getContestantById = async (pool: Pool, id: string): Promise<ContestantDetail | null> => {
  const result = await pool.query(
    `SELECT contestants.id,
            contestants.display_name AS "displayName",
            contestants.instagram_url AS "instagramUrl",
            contestants.youtube_url AS "youtubeUrl",
            contestants.website_url AS "websiteUrl",
            contestants.ticket_url AS "ticketUrl",
            COALESCE(
              ARRAY_AGG(contestant_aliases.alias ORDER BY contestant_aliases.alias)
                FILTER (WHERE contestant_aliases.alias IS NOT NULL),
              '{}'
            ) AS aliases
     FROM contestants
     LEFT JOIN contestant_aliases
       ON contestant_aliases.contestant_id = contestants.id
     WHERE contestants.id = $1
     GROUP BY contestants.id`,
    [id]
  );

  return result.rows[0] || null;
};

export type PerformanceWithEpisode = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  episodePublishedAt: string;
  youtubeUrl: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
  averageRating: number;
  ratingCount: number;
};

export const getPerformancesByContestantId = async (
  pool: Pool,
  contestantId: string
): Promise<PerformanceWithEpisode[]> => {
  const result = await pool.query(
    `SELECT p.id,
            p.episode_id AS "episodeId",
            e.title AS "episodeTitle",
            e.published_at AS "episodePublishedAt",
            e.youtube_url AS "youtubeUrl",
            p.start_seconds AS "startSeconds",
            p.end_seconds AS "endSeconds",
            p.confidence,
            p.intro_snippet AS "introSnippet",
            COALESCE(AVG(v.rating), 0)::float AS "averageRating",
            COUNT(v.rating)::int AS "ratingCount"
     FROM performances p
     JOIN episodes e ON e.id = p.episode_id
     LEFT JOIN votes v ON v.performance_id = p.id
     WHERE p.contestant_id = $1
     GROUP BY p.id, e.title, e.published_at, e.youtube_url
     ORDER BY "averageRating" DESC, "ratingCount" DESC, e.published_at DESC NULLS LAST`,
    [contestantId]
  );

  return result.rows as PerformanceWithEpisode[];
};
