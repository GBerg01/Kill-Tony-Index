import type { Pool } from "pg";

export type LeaderboardEntry = {
  contestantId: string;
  contestantName: string;
  averageRating: number;
  performanceCount: number;
  totalVotes: number;
};

export type LeaderboardParams = {
  limit?: number;
};

export const listContestantLeaderboard = async (
  pool: Pool,
  params?: LeaderboardParams
): Promise<LeaderboardEntry[]> => {
  const limit = params?.limit ?? 25;

  const result = await pool.query(
    `WITH performance_ratings AS (
       SELECT performance_id,
              AVG(rating)::float AS avg_rating,
              COUNT(*)::int AS vote_count
       FROM votes
       GROUP BY performance_id
     )
     SELECT c.id AS "contestantId",
            c.display_name AS "contestantName",
            AVG(COALESCE(performance_ratings.avg_rating, 0))::float AS "averageRating",
            COUNT(p.id)::int AS "performanceCount",
            COALESCE(SUM(performance_ratings.vote_count), 0)::int AS "totalVotes"
     FROM contestants c
     JOIN performances p ON p.contestant_id = c.id
     LEFT JOIN performance_ratings ON performance_ratings.performance_id = p.id
     GROUP BY c.id
     ORDER BY "averageRating" DESC, "totalVotes" DESC, "performanceCount" DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows as LeaderboardEntry[];
};
