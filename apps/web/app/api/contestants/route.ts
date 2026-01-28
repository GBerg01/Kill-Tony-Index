import { NextResponse } from "next/server";

import { getDbPool, listContestants } from "@killtony/db";

import { contestants } from "@/lib/mock-data";
import { logError } from "@/lib/logger";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: contestants });
  }

  try {
    const pool = getDbPool();
    const data = await listContestants(pool);

    return NextResponse.json({ data });
  } catch (error) {
    logError("Failed to load contestants", { error });
    return NextResponse.json(
      {
        data: contestants,
        error: { message: "Failed to load contestants", code: "CONTESTANTS_FETCH_FAILED" },
      },
      { status: 500 }
    );
  }
}
