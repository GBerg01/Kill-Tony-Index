import { NextResponse } from "next/server";

import { getDbPool, search } from "@killtony/db";
import type { SearchResult } from "@killtony/db";

import { episodes, contestants } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

function mockSearch(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search episodes
  for (const episode of episodes) {
    if (episode.title.toLowerCase().includes(q)) {
      results.push({
        type: "episode",
        id: episode.id,
        title: episode.title,
        subtitle: null,
        matchedOn: "title",
      });
    }
  }

  // Search contestants
  for (const contestant of contestants) {
    if (contestant.displayName.toLowerCase().includes(q)) {
      results.push({
        type: "contestant",
        id: contestant.id,
        title: contestant.displayName,
        subtitle: null,
        matchedOn: "name",
      });
    } else {
      // Search aliases
      const matchedAlias = contestant.aliases.find((alias) =>
        alias.toLowerCase().includes(q)
      );
      if (matchedAlias) {
        results.push({
          type: "contestant",
          id: contestant.id,
          title: contestant.displayName,
          subtitle: matchedAlias,
          matchedOn: "alias",
        });
      }
    }
  }

  return results;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

  if (!query.trim()) {
    return NextResponse.json({ data: [] });
  }

  if (!process.env.DATABASE_URL) {
    const results = mockSearch(query).slice(0, limit);
    return NextResponse.json({ data: results });
  }

  try {
    const pool = getDbPool();
    const results = await search(pool, { query, limit });
    return NextResponse.json({ data: results });
  } catch (error) {
    logError("Search failed", { error, query });
    // Fallback to mock search
    const results = mockSearch(query).slice(0, limit);
    return NextResponse.json({
      data: results,
      error: { message: "Search failed", code: "SEARCH_FAILED" },
    });
  }
}
