import { NextResponse } from "next/server";

import { getDbPool, listPerformances } from "@killtony/db";

import { performances } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: performances });
  }

  try {
    const pool = getDbPool();
    const data = await listPerformances(pool);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to load performances", error);
    return NextResponse.json(
      { data: performances, error: { message: "Failed to load performances" } },
      { status: 500 }
    );
  }
}
