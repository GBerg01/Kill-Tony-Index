import { NextResponse } from "next/server";

import { randomUUID } from "crypto";

import { createComment, getDbPool, listComments, type CommentRow } from "@killtony/db";

import { logError } from "@/lib/logger";

type CommentPayload = {
  email: string;
  displayName?: string;
  body: string;
};

const mockComments = new Map<string, CommentRow[]>();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const performanceId = params.id;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: mockComments.get(performanceId) ?? [] });
  }

  try {
    const pool = getDbPool();
    const comments = await listComments(pool, performanceId);
    return NextResponse.json({ data: comments });
  } catch (error) {
    logError("Failed to load comments", { error, performanceId });
    return NextResponse.json(
      { error: { message: "Failed to load comments", code: "COMMENTS_FETCH_FAILED" } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const performanceId = params.id;
  const payload = (await request.json()) as CommentPayload;

  if (!payload?.email || !payload?.body) {
    return NextResponse.json(
      { error: { message: "Email and comment body are required", code: "COMMENT_INVALID" } },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    const entry = mockComments.get(performanceId) ?? [];
    entry.unshift({
      id: randomUUID(),
      body: payload.body,
      createdAt: new Date().toISOString(),
      userId: payload.email,
      userDisplayName: payload.displayName ?? payload.email,
    });
    mockComments.set(performanceId, entry);
    return NextResponse.json({ data: entry });
  }

  try {
    const pool = getDbPool();
    await createComment(pool, {
      performanceId,
      email: payload.email,
      displayName: payload.displayName,
      body: payload.body,
    });
    const comments = await listComments(pool, performanceId);
    return NextResponse.json({ data: comments });
  } catch (error) {
    logError("Failed to submit comment", { error, performanceId });
    return NextResponse.json(
      { error: { message: "Failed to submit comment", code: "COMMENT_SUBMIT_FAILED" } },
      { status: 500 }
    );
  }
}
