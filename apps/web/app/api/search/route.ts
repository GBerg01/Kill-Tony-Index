import { NextResponse } from "next/server";

import { getDbPool, searchAll, type SearchResults } from "@killtony/db";

import { contestants, episodes } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

const MAX_LIMIT = 20;

const normalizeQuery = (query: string) => query.trim();

const filterMockData = (query: string, limit: number): SearchResults => {
  const normalized = query.toLowerCase();

  const filteredEpisodes = episodes
    .filter((episode) => episode.title.toLowerCase().includes(normalized))
    .slice(0, limit)
    .map((episode) => ({
      id: episode.id,
      title: episode.title,
      publishedAt: episode.publishedAt,
      youtubeUrl: episode.youtubeUrl,
    }));

  const filteredContestants = contestants
    .filter((contestant) => {
      const matchesName = contestant.displayName.toLowerCase().includes(normalized);
      const matchesAlias = contestant.aliases.some((alias) => alias.toLowerCase().includes(normalized));
      return matchesName || matchesAlias;
    })
    .slice(0, limit)
    .map((contestant) => ({
      id: contestant.id,
      displayName: contestant.displayName,
      aliases: contestant.aliases,
    }));

  return {
    episodes: filteredEpisodes,
    contestants: filteredContestants,
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("query") || "";
  const query = normalizeQuery(rawQuery);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), MAX_LIMIT);

  if (!query) {
    return NextResponse.json(
      { error: { message: "Query parameter is required", code: "SEARCH_QUERY_REQUIRED" } },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    const results = filterMockData(query, limit);
    return NextResponse.json({ query, ...results });
  }

  try {
    const pool = getDbPool();
    const results = await searchAll(pool, query, { limit });

    return NextResponse.json({ query, ...results });
  } catch (error) {
    logError("Failed to search", { error, query });
    const results = filterMockData(query, limit);
    return NextResponse.json(
      { query, ...results, error: { message: "Failed to search", code: "SEARCH_FAILED" } },
      { status: 500 }
    );
  }
}
