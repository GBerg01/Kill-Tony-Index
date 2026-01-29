import { randomUUID } from "crypto";
import type { Pool } from "pg";

import { getOrCreateUserIdByEmail } from "./users";

export type RatingSummary = {
  average: number;
  count: number;
};

export type RatingInput = {
  performanceId: string;
  email: string;
  displayName?: string | null;
  rating: number;
};

export const getRatingSummary = async (pool: Pool, performanceId: string): Promise<RatingSummary> => {
  const result = await pool.query(
    `SELECT COALESCE(AVG(rating), 0) AS average, COUNT(*) AS count
     FROM votes
     WHERE performance_id = $1`,
    [performanceId]
  );

  return {
    average: parseFloat(result.rows[0].average) || 0,
    count: parseInt(result.rows[0].count, 10) || 0,
  };
};

export const upsertRating = async (pool: Pool, input: RatingInput): Promise<void> => {
  const userId = await getOrCreateUserIdByEmail(pool, {
    email: input.email,
    displayName: input.displayName,
  });

  await pool.query(
    `INSERT INTO votes (id, performance_id, user_id, rating, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     ON CONFLICT (performance_id, user_id)
     DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()`,
    [randomUUID(), input.performanceId, userId, input.rating]
  );
};
