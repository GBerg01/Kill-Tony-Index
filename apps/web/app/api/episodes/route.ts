import { NextResponse } from "next/server";

import { getDbPool, listEpisodes } from "@killtony/db";

import { episodes } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: episodes });
  }

  try {
    const pool = getDbPool();
    const data = await listEpisodes(pool);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to load episodes", error);
    return NextResponse.json({ data: episodes }, { status: 500 });
  }
}
