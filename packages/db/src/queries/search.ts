import type { Pool } from "pg";

export type SearchEpisodeResult = {
  id: string;
  title: string;
  publishedAt: string | null;
  youtubeUrl: string;
};

export type SearchContestantResult = {
  id: string;
  displayName: string;
  aliases: string[];
};

export type SearchResults = {
  episodes: SearchEpisodeResult[];
  contestants: SearchContestantResult[];
};

export type SearchParams = {
  limit?: number;
};

export const searchAll = async (pool: Pool, query: string, params?: SearchParams): Promise<SearchResults> => {
  const limit = params?.limit ?? 10;

  const [episodesResult, contestantsResult] = await Promise.all([
    pool.query(
      `SELECT id,
              title,
              published_at AS "publishedAt",
              youtube_url AS "youtubeUrl",
              ts_rank(
                to_tsvector('english', title),
                websearch_to_tsquery('english', $1)
              ) AS rank
       FROM episodes
       WHERE to_tsvector('english', title) @@ websearch_to_tsquery('english', $1)
       ORDER BY rank DESC
       LIMIT $2`,
      [query, limit]
    ),
    pool.query(
      `WITH alias_data AS (
         SELECT contestant_id,
                string_agg(alias, ' ') AS alias_text,
                array_agg(alias ORDER BY alias) AS aliases
         FROM contestant_aliases
         GROUP BY contestant_id
       )
       SELECT c.id,
              c.display_name AS "displayName",
              COALESCE(alias_data.aliases, ARRAY[]::text[]) AS aliases,
              ts_rank(
                to_tsvector(
                  'english',
                  c.display_name || ' ' || COALESCE(alias_data.alias_text, '')
                ),
                websearch_to_tsquery('english', $1)
              ) AS rank
       FROM contestants c
       LEFT JOIN alias_data ON alias_data.contestant_id = c.id
       WHERE to_tsvector(
              'english',
              c.display_name || ' ' || COALESCE(alias_data.alias_text, '')
            ) @@ websearch_to_tsquery('english', $1)
       ORDER BY rank DESC
       LIMIT $2`,
      [query, limit]
    ),
  ]);

  return {
    episodes: episodesResult.rows as SearchEpisodeResult[],
    contestants: contestantsResult.rows as SearchContestantResult[],
  };
};
