import { NextResponse } from "next/server";

import { createDbPool, listEpisodes } from "@killtony/db";

import { episodes } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: episodes });
  }

  const pool = createDbPool();
  const data = await listEpisodes(pool);

  return NextResponse.json({ data });
}
