import { NextResponse } from "next/server";

import { getDbPool, getRatingSummary, upsertRating, type RatingSummary } from "@killtony/db";

import { logError } from "@/lib/logger";

type RatingPayload = {
  email: string;
  displayName?: string;
  rating: number;
};

const mockRatings = new Map<string, { total: number; count: number; users: Map<string, number> }>();

const getMockSummary = (performanceId: string): RatingSummary => {
  const entry = mockRatings.get(performanceId);
  if (!entry || entry.count === 0) {
    return { average: 0, count: 0 };
  }
  return { average: entry.total / entry.count, count: entry.count };
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const performanceId = params.id;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(getMockSummary(performanceId));
  }

  try {
    const pool = getDbPool();
    const summary = await getRatingSummary(pool, performanceId);
    return NextResponse.json(summary);
  } catch (error) {
    logError("Failed to load ratings", { error, performanceId });
    return NextResponse.json(
      { error: { message: "Failed to load ratings", code: "RATINGS_FETCH_FAILED" } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const performanceId = params.id;
  const payload = (await request.json()) as RatingPayload;

  if (!payload?.email || !payload?.rating) {
    return NextResponse.json(
      { error: { message: "Email and rating are required", code: "RATING_INVALID" } },
      { status: 400 }
    );
  }

  const rating = Math.round(payload.rating);
  if (rating < 1 || rating > 10) {
    return NextResponse.json(
      { error: { message: "Rating must be between 1 and 10", code: "RATING_OUT_OF_RANGE" } },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    const entry = mockRatings.get(performanceId) ?? {
      total: 0,
      count: 0,
      users: new Map<string, number>(),
    };
    const previous = entry.users.get(payload.email);
    if (previous) {
      entry.total -= previous;
    } else {
      entry.count += 1;
    }
    entry.total += rating;
    entry.users.set(payload.email, rating);
    mockRatings.set(performanceId, entry);
    return NextResponse.json(getMockSummary(performanceId));
  }

  try {
    const pool = getDbPool();
    await upsertRating(pool, {
      performanceId,
      email: payload.email,
      displayName: payload.displayName,
      rating,
    });
    const summary = await getRatingSummary(pool, performanceId);
    return NextResponse.json(summary);
  } catch (error) {
    logError("Failed to submit rating", { error, performanceId });
    return NextResponse.json(
      { error: { message: "Failed to submit rating", code: "RATING_SUBMIT_FAILED" } },
      { status: 500 }
    );
  }
}
