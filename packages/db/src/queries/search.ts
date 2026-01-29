import type { Pool } from "pg";

export type SearchResult = {
  type: "episode" | "contestant";
  id: string;
  title: string;
  subtitle: string | null;
  matchedOn: string;
};

export type SearchParams = {
  query: string;
  limit?: number;
};

export const search = async (
  pool: Pool,
  params: SearchParams
): Promise<SearchResult[]> => {
  const { query, limit = 20 } = params;

  if (!query.trim()) {
    return [];
  }

  // Convert search query to tsquery format
  // Split on spaces and join with & for AND matching
  const tsQuery = query
    .trim()
    .split(/\s+/)
    .map((term) => `${term}:*`)
    .join(" & ");

  const result = await pool.query(
    `
    WITH episode_matches AS (
      SELECT
        'episode' AS type,
        id,
        title,
        NULL AS subtitle,
        'title' AS matched_on,
        ts_rank(to_tsvector('english', title), to_tsquery('english', $1)) AS rank
      FROM episodes
      WHERE to_tsvector('english', title) @@ to_tsquery('english', $1)
    ),
    contestant_name_matches AS (
      SELECT
        'contestant' AS type,
        id,
        display_name AS title,
        NULL AS subtitle,
        'name' AS matched_on,
        ts_rank(to_tsvector('english', display_name), to_tsquery('english', $1)) AS rank
      FROM contestants
      WHERE to_tsvector('english', display_name) @@ to_tsquery('english', $1)
    ),
    contestant_alias_matches AS (
      SELECT DISTINCT ON (c.id)
        'contestant' AS type,
        c.id,
        c.display_name AS title,
        ca.alias AS subtitle,
        'alias' AS matched_on,
        ts_rank(to_tsvector('english', ca.alias), to_tsquery('english', $1)) AS rank
      FROM contestants c
      JOIN contestant_aliases ca ON ca.contestant_id = c.id
      WHERE to_tsvector('english', ca.alias) @@ to_tsquery('english', $1)
    ),
    all_matches AS (
      SELECT * FROM episode_matches
      UNION ALL
      SELECT * FROM contestant_name_matches
      UNION ALL
      SELECT * FROM contestant_alias_matches
    )
    SELECT DISTINCT ON (type, id)
      type,
      id,
      title,
      subtitle,
      matched_on AS "matchedOn"
    FROM all_matches
    ORDER BY type, id, rank DESC
    LIMIT $2
    `,
    [tsQuery, limit]
  );

  return result.rows as SearchResult[];
};
