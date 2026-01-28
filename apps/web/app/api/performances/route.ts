import { NextResponse } from "next/server";

import { performances } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ data: performances });
}
