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
