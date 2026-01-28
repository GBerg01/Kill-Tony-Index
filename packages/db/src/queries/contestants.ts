import type { Pool } from "pg";

import type { Contestant } from "@killtony/shared/src/types";

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
