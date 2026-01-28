import { NextResponse } from "next/server";

import { getDbPool, listContestants } from "@killtony/db";

import { contestants } from "@/lib/mock-data";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: contestants });
  }

  try {
    const pool = getDbPool();
    const data = await listContestants(pool);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to load contestants", error);
    return NextResponse.json({ data: contestants }, { status: 500 });
  }
}
