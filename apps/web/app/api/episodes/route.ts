import { NextResponse } from "next/server";

import { getDbPool, listEpisodes } from "@killtony/db";

import { episodes } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const offset = (page - 1) * limit;

  if (!process.env.DATABASE_URL) {
    const paginatedEpisodes = episodes.slice(offset, offset + limit);
    return NextResponse.json({
      data: paginatedEpisodes,
      pagination: {
        page,
        limit,
        total: episodes.length,
        totalPages: Math.ceil(episodes.length / limit),
      },
    });
  }

  try {
    const pool = getDbPool();
    const result = await listEpisodes(pool, { limit, offset });

    return NextResponse.json({
      data: result.items,
      pagination: {
        page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    logError("Failed to load episodes", { error });
    const paginatedEpisodes = episodes.slice(offset, offset + limit);
    return NextResponse.json(
      {
        data: paginatedEpisodes,
        pagination: {
          page,
          limit,
          total: episodes.length,
          totalPages: Math.ceil(episodes.length / limit),
        },
        error: { message: "Failed to load episodes", code: "EPISODES_FETCH_FAILED" },
      },
      { status: 500 }
    );
  }
}
