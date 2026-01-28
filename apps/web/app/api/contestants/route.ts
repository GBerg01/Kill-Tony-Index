import { NextResponse } from "next/server";

import { createDbPool, listContestants } from "@killtony/db";

import { contestants } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: contestants });
  }

  const pool = createDbPool();
  const data = await listContestants(pool);

  return NextResponse.json({ data });
}
