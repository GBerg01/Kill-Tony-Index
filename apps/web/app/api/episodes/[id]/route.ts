import { NextResponse } from "next/server";

import { getDbPool, getEpisodeById, getPerformancesByEpisodeId } from "@killtony/db";

import { episodes, performances, contestants } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

type PerformanceWithContestant = {
  id: string;
  episodeId: string;
  contestantId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!process.env.DATABASE_URL) {
    // Use mock data
    const episode = episodes.find((e) => e.id === id);
    if (!episode) {
      return NextResponse.json(
        { error: { message: "Episode not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const episodePerformances: PerformanceWithContestant[] = performances
      .filter((p) => p.episodeId === id)
      .map((p) => {
        const contestant = contestants.find((c) => c.id === p.contestantId);
        return {
          ...p,
          contestantName: contestant?.displayName || "Unknown",
        };
      });

    return NextResponse.json({ data: { episode, performances: episodePerformances } });
  }

  try {
    const pool = getDbPool();
    const episode = await getEpisodeById(pool, id);

    if (!episode) {
      return NextResponse.json(
        { error: { message: "Episode not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const episodePerformances = await getPerformancesByEpisodeId(pool, id);

    return NextResponse.json({ data: { episode, performances: episodePerformances } });
  } catch (error) {
    logError("Failed to load episode", { error, episodeId: id });

    // Fallback to mock data on error
    const episode = episodes.find((e) => e.id === id);
    if (!episode) {
      return NextResponse.json(
        { error: { message: "Episode not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const episodePerformances: PerformanceWithContestant[] = performances
      .filter((p) => p.episodeId === id)
      .map((p) => {
        const contestant = contestants.find((c) => c.id === p.contestantId);
        return {
          ...p,
          contestantName: contestant?.displayName || "Unknown",
        };
      });

    return NextResponse.json({
      data: { episode, performances: episodePerformances },
      error: { message: "Failed to load episode from database", code: "EPISODE_FETCH_FAILED" },
    });
  }
}
