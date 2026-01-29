import { NextResponse } from "next/server";

import { getDbPool, listContestantLeaderboard, type LeaderboardEntry } from "@killtony/db";

import { contestants, performances } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

const DEFAULT_LIMIT = 25;

const buildMockLeaderboard = (): LeaderboardEntry[] => {
  return contestants.map((contestant) => {
    const contestantPerformances = performances.filter((performance) => performance.contestantId === contestant.id);

    return {
      contestantId: contestant.id,
      contestantName: contestant.displayName,
      averageRating: 0,
      performanceCount: contestantPerformances.length,
      totalVotes: 0,
    };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10), 100);

  if (!process.env.DATABASE_URL) {
    const data = buildMockLeaderboard();
    return NextResponse.json({ data: data.slice(0, limit) });
  }

  try {
    const pool = getDbPool();
    const data = await listContestantLeaderboard(pool, { limit });
    return NextResponse.json({ data });
  } catch (error) {
    logError("Failed to load leaderboard", { error });
    const data = buildMockLeaderboard();
    return NextResponse.json(
      { data: data.slice(0, limit), error: { message: "Failed to load leaderboard" } },
      { status: 500 }
    );
  }
}
