import { NextResponse } from "next/server";

import { getDbPool, getPerformanceById } from "@killtony/db";

import { performances, episodes, contestants } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

type PerformanceDetail = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  episodePublishedAt: string;
  youtubeUrl: string;
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
    const performance = performances.find((p) => p.id === id);
    if (!performance) {
      return NextResponse.json(
        { error: { message: "Performance not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const episode = episodes.find((e) => e.id === performance.episodeId);
    const contestant = contestants.find((c) => c.id === performance.contestantId);

    const performanceDetail: PerformanceDetail = {
      id: performance.id,
      episodeId: performance.episodeId,
      episodeTitle: episode?.title || "Unknown Episode",
      episodePublishedAt: episode?.publishedAt || "",
      youtubeUrl: episode?.youtubeUrl || "",
      contestantId: performance.contestantId,
      contestantName: contestant?.displayName || "Unknown",
      startSeconds: performance.startSeconds,
      endSeconds: performance.endSeconds ?? null,
      confidence: performance.confidence,
      introSnippet: performance.introSnippet,
    };

    return NextResponse.json({ data: performanceDetail });
  }

  try {
    const pool = getDbPool();
    const performanceDetail = await getPerformanceById(pool, id);

    if (!performanceDetail) {
      return NextResponse.json(
        { error: { message: "Performance not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: performanceDetail });
  } catch (error) {
    logError("Failed to load performance", { error, performanceId: id });

    // Fallback to mock data on error
    const performance = performances.find((p) => p.id === id);
    if (!performance) {
      return NextResponse.json(
        { error: { message: "Performance not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const episode = episodes.find((e) => e.id === performance.episodeId);
    const contestant = contestants.find((c) => c.id === performance.contestantId);

    const performanceDetail: PerformanceDetail = {
      id: performance.id,
      episodeId: performance.episodeId,
      episodeTitle: episode?.title || "Unknown Episode",
      episodePublishedAt: episode?.publishedAt || "",
      youtubeUrl: episode?.youtubeUrl || "",
      contestantId: performance.contestantId,
      contestantName: contestant?.displayName || "Unknown",
      startSeconds: performance.startSeconds,
      endSeconds: performance.endSeconds ?? null,
      confidence: performance.confidence,
      introSnippet: performance.introSnippet,
    };

    return NextResponse.json({
      data: performanceDetail,
      error: { message: "Failed to load performance from database", code: "PERFORMANCE_FETCH_FAILED" },
    });
  }
}
