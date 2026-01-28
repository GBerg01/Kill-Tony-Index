import type { Pool } from "pg";

import type { Performance } from "@killtony/shared/src/types";

export const listPerformances = async (pool: Pool): Promise<Performance[]> => {
  const result = await pool.query(
    `SELECT id,
            episode_id AS "episodeId",
            contestant_id AS "contestantId",
            start_seconds AS "startSeconds",
            end_seconds AS "endSeconds",
            confidence,
            intro_snippet AS "introSnippet"
     FROM performances
     ORDER BY created_at DESC`
  );

  return result.rows as Performance[];
};
