import { NextResponse } from "next/server";

import { getDbPool, listTrendingPerformances, type TrendingPerformance } from "@killtony/db";

import { logError } from "@/lib/logger";

type ConfidenceLevel = "High" | "Medium" | "Low";

const getConfidenceLevel = (confidence: number): ConfidenceLevel => {
  if (confidence >= 0.85) return "High";
  if (confidence >= 0.7) return "Medium";
  return "Low";
};

const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const buildYouTubeJumpUrl = (youtubeUrl: string, seconds: number): string => {
  if (!youtubeUrl) return "#";
  const joiner = youtubeUrl.includes("?") ? "&" : "?";
  return `${youtubeUrl}${joiner}t=${seconds}`;
};

type TransformedTrendingPerformance = {
  id: string;
  contestantName: string;
  contestantId: string;
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeDate: string;
  timestampSeconds: number;
  timestampLabel: string;
  youtubeUrl: string;
  youtubeJumpUrl: string;
  snippet: string;
  ratingAvg: number;
  ratingCount: number;
  commentCount: number;
  confidence: ConfidenceLevel;
};

const transformPerformance = (item: TrendingPerformance): TransformedTrendingPerformance => ({
  id: item.id,
  contestantName: item.contestantName,
  contestantId: item.contestantId,
  episodeId: item.episodeId,
  episodeNumber: item.episodeNumber ?? 0,
  episodeTitle: item.episodeTitle,
  episodeDate: item.episodeDate ? new Date(item.episodeDate).toISOString().split("T")[0] : "",
  timestampSeconds: item.startSeconds,
  timestampLabel: formatTimestamp(item.startSeconds),
  youtubeUrl: item.youtubeUrl,
  youtubeJumpUrl: buildYouTubeJumpUrl(item.youtubeUrl, item.startSeconds),
  snippet: item.introSnippet,
  ratingAvg: item.ratingAvg,
  ratingCount: item.ratingCount,
  commentCount: item.commentCount,
  confidence: getConfidenceLevel(item.confidence),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10), 20);

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: [] });
  }

  try {
    const pool = getDbPool();
    const items = await listTrendingPerformances(pool, limit);
    const transformedItems = items.map(transformPerformance);

    return NextResponse.json({ data: transformedItems });
  } catch (error) {
    logError("Failed to load trending performances", { error });
    return NextResponse.json(
      { data: [], error: { message: "Failed to load trending performances" } },
      { status: 500 }
    );
  }
}
