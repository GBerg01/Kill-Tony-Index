import { randomUUID } from "crypto";
import type { Pool } from "pg";

export const getOrCreateUserIdByEmail = async (
  pool: Pool,
  {
    email,
    displayName,
  }: {
    email: string;
    displayName?: string | null;
  }
): Promise<string> => {
  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (existing.rows[0]?.id) {
    return existing.rows[0].id as string;
  }

  const id = randomUUID();
  await pool.query(
    `INSERT INTO users (id, email, display_name)
     VALUES ($1, $2, $3)`,
    [id, email, displayName ?? null]
  );

  return id;
};
