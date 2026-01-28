import { NextResponse } from "next/server";

import { createDbPool, listPerformances } from "@killtony/db";

import { performances } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: performances });
  }

  const pool = createDbPool();
  const data = await listPerformances(pool);

  return NextResponse.json({ data });
}
