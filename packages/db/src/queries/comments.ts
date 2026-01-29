import { randomUUID } from "crypto";
import type { Pool } from "pg";

import { getOrCreateUserIdByEmail } from "./users";

export type CommentRow = {
  id: string;
  body: string;
  createdAt: string;
  userId: string;
  userDisplayName: string | null;
};

export type CommentInput = {
  performanceId: string;
  email: string;
  displayName?: string | null;
  body: string;
};

export const listComments = async (pool: Pool, performanceId: string): Promise<CommentRow[]> => {
  const result = await pool.query(
    `SELECT c.id,
            c.body,
            c.created_at AS "createdAt",
            u.id AS "userId",
            u.display_name AS "userDisplayName"
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.performance_id = $1 AND c.is_flagged = FALSE
     ORDER BY c.created_at DESC`,
    [performanceId]
  );

  return result.rows as CommentRow[];
};

export const createComment = async (pool: Pool, input: CommentInput): Promise<void> => {
  const userId = await getOrCreateUserIdByEmail(pool, {
    email: input.email,
    displayName: input.displayName,
  });

  await pool.query(
    `INSERT INTO comments (id, performance_id, user_id, body, is_flagged, created_at, updated_at)
     VALUES ($1, $2, $3, $4, FALSE, NOW(), NOW())`,
    [randomUUID(), input.performanceId, userId, input.body]
  );
};
