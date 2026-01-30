import { NextResponse } from "next/server";

import { getDbPool, getContestantById, getPerformancesByContestantId } from "@killtony/db";

import { contestants, performances, episodes } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

import type { ContestantDetail } from "@killtony/shared/src/types";

type PerformanceWithEpisode = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  episodeNumber: number | null;
  episodePublishedAt: string;
  youtubeUrl: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
  averageRating: number;
  ratingCount: number;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!process.env.DATABASE_URL) {
    // Use mock data
    const contestant = contestants.find((c) => c.id === id);
    if (!contestant) {
      return NextResponse.json(
        { error: { message: "Contestant not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const contestantDetail: ContestantDetail = {
      ...contestant,
      instagramUrl: null,
      youtubeUrl: null,
      websiteUrl: null,
      ticketUrl: null,
    };

    const contestantPerformances: PerformanceWithEpisode[] = performances
      .filter((p) => p.contestantId === id)
      .map((p) => {
        const episode = episodes.find((e) => e.id === p.episodeId);
        return {
          id: p.id,
          episodeId: p.episodeId,
          episodeTitle: episode?.title || "Unknown Episode",
          episodeNumber: episode?.episodeNumber ?? null,
          episodePublishedAt: episode?.publishedAt || "",
          youtubeUrl: episode?.youtubeUrl || "",
          startSeconds: p.startSeconds,
          endSeconds: p.endSeconds ?? null,
          confidence: p.confidence,
          introSnippet: p.introSnippet,
          averageRating: 0,
          ratingCount: 0,
        };
      });

    return NextResponse.json({ data: { contestant: contestantDetail, performances: contestantPerformances } });
  }

  try {
    const pool = getDbPool();
    const contestant = await getContestantById(pool, id);

    if (!contestant) {
      return NextResponse.json(
        { error: { message: "Contestant not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const contestantPerformances = await getPerformancesByContestantId(pool, id);

    return NextResponse.json({ data: { contestant, performances: contestantPerformances } });
  } catch (error) {
    logError("Failed to load contestant", { error, contestantId: id });

    // Fallback to mock data on error
    const contestant = contestants.find((c) => c.id === id);
    if (!contestant) {
      return NextResponse.json(
        { error: { message: "Contestant not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const contestantDetail: ContestantDetail = {
      ...contestant,
      instagramUrl: null,
      youtubeUrl: null,
      websiteUrl: null,
      ticketUrl: null,
    };

    const contestantPerformances: PerformanceWithEpisode[] = performances
      .filter((p) => p.contestantId === id)
      .map((p) => {
        const episode = episodes.find((e) => e.id === p.episodeId);
        return {
          id: p.id,
          episodeId: p.episodeId,
          episodeTitle: episode?.title || "Unknown Episode",
          episodeNumber: episode?.episodeNumber ?? null,
          episodePublishedAt: episode?.publishedAt || "",
          youtubeUrl: episode?.youtubeUrl || "",
          startSeconds: p.startSeconds,
          endSeconds: p.endSeconds ?? null,
          confidence: p.confidence,
          introSnippet: p.introSnippet,
          averageRating: 0,
          ratingCount: 0,
        };
      });

    return NextResponse.json({
      data: { contestant: contestantDetail, performances: contestantPerformances },
      error: { message: "Failed to load contestant from database", code: "CONTESTANT_FETCH_FAILED" },
    });
  }
}
