import type { Pool } from "pg";

import type { Contestant, ContestantDetail } from "@killtony/shared/src/types";

export const listContestants = async (pool: Pool): Promise<Contestant[]> => {
  const result = await pool.query(
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
     ORDER BY contestants.display_name ASC`
  );

  return result.rows as Contestant[];
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
            p.intro_snippet AS "introSnippet"
     FROM performances p
     JOIN episodes e ON e.id = p.episode_id
     WHERE p.contestant_id = $1
     ORDER BY e.published_at DESC NULLS LAST`,
    [contestantId]
  );

  return result.rows as PerformanceWithEpisode[];
};
