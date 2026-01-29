import { NextResponse } from "next/server";

import { getDbPool, listReviewQueue, type ReviewQueueItem } from "@killtony/db";

import { contestants, episodes, performances } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

const DEFAULT_LIMIT = 25;
const DEFAULT_CONFIDENCE_THRESHOLD = 0.7;

const buildMockQueue = (): ReviewQueueItem[] => {
  return performances.map((performance) => {
    const episode = episodes.find((item) => item.id === performance.episodeId);
    const contestant = contestants.find((item) => item.id === performance.contestantId);

    return {
      id: performance.id,
      episodeId: performance.episodeId,
      episodeTitle: episode?.title ?? "Unknown episode",
      youtubeUrl: episode?.youtubeUrl ?? "",
      contestantId: performance.contestantId,
      contestantName: contestant?.displayName ?? "Unknown contestant",
      startSeconds: performance.startSeconds,
      endSeconds: performance.endSeconds ?? null,
      confidence: performance.confidence,
      introSnippet: performance.introSnippet,
    };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10), 100);
  const confidenceThreshold = parseFloat(
    searchParams.get("confidenceThreshold") || `${DEFAULT_CONFIDENCE_THRESHOLD}`
  );

  if (!process.env.DATABASE_URL) {
    const data = buildMockQueue().filter((item) => item.confidence < confidenceThreshold);
    return NextResponse.json({ data: data.slice(0, limit) });
  }

  try {
    const pool = getDbPool();
    const data = await listReviewQueue(pool, { limit, confidenceThreshold });
    return NextResponse.json({ data });
  } catch (error) {
    logError("Failed to load review queue", { error });
    const data = buildMockQueue().filter((item) => item.confidence < confidenceThreshold);
    return NextResponse.json(
      { data: data.slice(0, limit), error: { message: "Failed to load review queue" } },
      { status: 500 }
    );
  }
}
