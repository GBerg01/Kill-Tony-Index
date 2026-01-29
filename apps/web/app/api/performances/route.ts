import { NextResponse } from "next/server";

import { getDbPool, listPerformances } from "@killtony/db";

import { performances } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const offset = (page - 1) * limit;

  if (!process.env.DATABASE_URL) {
    const paginatedPerformances = performances.slice(offset, offset + limit);
    return NextResponse.json({
      data: paginatedPerformances,
      pagination: {
        page,
        limit,
        total: performances.length,
        totalPages: Math.ceil(performances.length / limit),
      },
    });
  }

  try {
    const pool = getDbPool();
    const result = await listPerformances(pool, { limit, offset });

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
    logError("Failed to load performances", { error });
    const paginatedPerformances = performances.slice(offset, offset + limit);
    return NextResponse.json(
      {
        data: paginatedPerformances,
        pagination: {
          page,
          limit,
          total: performances.length,
          totalPages: Math.ceil(performances.length / limit),
        },
        error: { message: "Failed to load performances", code: "PERFORMANCES_FETCH_FAILED" },
      },
      { status: 500 }
    );
  }
}
