import { NextResponse } from "next/server";

import { getDbPool, listContestants } from "@killtony/db";

import { contestants } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const offset = (page - 1) * limit;

  if (!process.env.DATABASE_URL) {
    const paginatedContestants = contestants.slice(offset, offset + limit);
    return NextResponse.json({
      data: paginatedContestants,
      pagination: {
        page,
        limit,
        total: contestants.length,
        totalPages: Math.ceil(contestants.length / limit),
      },
    });
  }

  try {
    const pool = getDbPool();
    const result = await listContestants(pool, { limit, offset });

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
    logError("Failed to load contestants", { error });
    const paginatedContestants = contestants.slice(offset, offset + limit);
    return NextResponse.json(
      {
        data: paginatedContestants,
        pagination: {
          page,
          limit,
          total: contestants.length,
          totalPages: Math.ceil(contestants.length / limit),
        },
        error: { message: "Failed to load contestants", code: "CONTESTANTS_FETCH_FAILED" },
      },
      { status: 500 }
    );
  }
}
