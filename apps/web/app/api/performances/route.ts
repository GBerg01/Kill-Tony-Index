import { NextResponse } from "next/server";

import { getDbPool, listPerformancesWithDetails, type PerformanceListItem } from "@killtony/db";

import { performances as mockPerformances } from "@/lib/mock-data";
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

type TransformedPerformance = {
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

const transformPerformance = (item: PerformanceListItem): TransformedPerformance => ({
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

const buildMockPerformances = (): TransformedPerformance[] => {
  return mockPerformances.map((p) => ({
    id: p.id,
    contestantName: "Unknown",
    contestantId: p.contestantId,
    episodeId: p.episodeId,
    episodeNumber: 0,
    episodeTitle: "Episode",
    episodeDate: "",
    timestampSeconds: p.startSeconds,
    timestampLabel: formatTimestamp(p.startSeconds),
    youtubeUrl: "",
    youtubeJumpUrl: "#",
    snippet: p.introSnippet,
    ratingAvg: 0,
    ratingCount: 0,
    commentCount: 0,
    confidence: getConfidenceLevel(p.confidence),
  }));
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const offset = (page - 1) * limit;

  if (!process.env.DATABASE_URL) {
    const mockData = buildMockPerformances();
    const paginatedPerformances = mockData.slice(offset, offset + limit);
    return NextResponse.json({
      data: paginatedPerformances,
      pagination: {
        page,
        limit,
        total: mockData.length,
        totalPages: Math.ceil(mockData.length / limit),
      },
    });
  }

  try {
    const pool = getDbPool();
    const result = await listPerformancesWithDetails(pool, { limit, offset });
    const transformedItems = result.items.map(transformPerformance);

    return NextResponse.json({
      data: transformedItems,
      pagination: {
        page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    logError("Failed to load performances", { error });
    const mockData = buildMockPerformances();
    const paginatedPerformances = mockData.slice(offset, offset + limit);
    return NextResponse.json(
      {
        data: paginatedPerformances,
        pagination: {
          page,
          limit,
          total: mockData.length,
          totalPages: Math.ceil(mockData.length / limit),
        },
        error: { message: "Failed to load performances", code: "PERFORMANCES_FETCH_FAILED" },
      },
      { status: 500 }
    );
  }
}
