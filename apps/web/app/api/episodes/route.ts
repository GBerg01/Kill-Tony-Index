import { NextResponse } from "next/server";

import { getDbPool, listEpisodes } from "@killtony/db";

import { episodes } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: episodes });
  }

  try {
    const pool = getDbPool();
    const data = await listEpisodes(pool);

    return NextResponse.json({ data });
  } catch (error) {
    logError("Failed to load episodes", { error });
    return NextResponse.json(
      {
        data: episodes,
        error: { message: "Failed to load episodes", code: "EPISODES_FETCH_FAILED" },
      },
      { status: 500 }
    );
  }
}
