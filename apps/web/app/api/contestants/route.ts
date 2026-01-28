import { NextResponse } from "next/server";

import { contestants } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: contestants });
}
