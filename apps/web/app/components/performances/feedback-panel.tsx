"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

type RatingSummary = {
  average: number;
  count: number;
};

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  userDisplayName: string | null;
};

type CommentResponse = {
  data: Comment[];
  error?: { message: string; code: string };
};

type RatingResponse = RatingSummary & {
  error?: { message: string; code: string };
};

type FeedbackPanelProps = {
  performanceId: string;
};

export function FeedbackPanel({ performanceId }: FeedbackPanelProps) {
  const { data: session } = useSession();
  const [ratingSummary, setRatingSummary] = useState<RatingSummary>({ average: 0, count: 0 });
  const [ratingValue, setRatingValue] = useState("8");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0;
  }, [email]);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const [ratingRes, commentRes] = await Promise.all([
          fetch(`/api/performances/${performanceId}/ratings`),
          fetch(`/api/performances/${performanceId}/comments`),
        ]);
        const ratingData = (await ratingRes.json()) as RatingResponse;
        const commentData = (await commentRes.json()) as CommentResponse;

        if (ratingRes.ok) {
          setRatingSummary({ average: ratingData.average, count: ratingData.count });
        }
        if (commentRes.ok) {
          setComments(commentData.data);
        }
      } catch (error) {
        setErrorMessage("Unable to load ratings or comments.");
      }
    };

    loadFeedback();
  }, [performanceId]);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
    if (session?.user?.name) {
      setDisplayName(session.user.name);
    }
  }, [session?.user?.email, session?.user?.name]);

  const handleRatingSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage("Please provide an email to rate this performance.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/performances/${performanceId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          displayName,
          rating: Number(ratingValue),
        }),
      });
      const data = (await response.json()) as RatingResponse;
      if (!response.ok) {
        setErrorMessage(data.error?.message || "Rating failed.");
      } else {
        setRatingSummary({ average: data.average, count: data.count });
        setStatusMessage("Rating saved.");
      }
    } catch (error) {
      setErrorMessage("Rating failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!canSubmit) {
      setErrorMessage("Please provide an email to comment.");
      return;
    }
    if (!commentBody.trim()) {
      setErrorMessage("Comment cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/performances/${performanceId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          displayName,
          body: commentBody.trim(),
        }),
      });
      const data = (await response.json()) as CommentResponse;
      if (!response.ok) {
        setErrorMessage(data.error?.message || "Comment failed.");
      } else {
        setComments(data.data);
        setCommentBody("");
        setStatusMessage("Comment posted.");
      }
    } catch (error) {
      setErrorMessage("Comment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{
        padding: "1.5rem",
        backgroundColor: "#141414",
        borderRadius: "8px",
        border: "1px solid #333",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Ratings &amp; Comments</h2>

      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ margin: 0, color: "#bbb" }}>
            Average rating:{" "}
            <strong style={{ color: "#fff" }}>{ratingSummary.average.toFixed(1)}</strong> (
            {ratingSummary.count} ratings)
          </p>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {session?.user?.email && (
            <p style={{ margin: 0, color: "#9ca3af" }}>
              Signed in as <strong style={{ color: "#e5e7eb" }}>{session.user.email}</strong>
            </p>
          )}
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ color: "#999" }}>Your email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              readOnly={Boolean(session?.user?.email)}
              placeholder="you@example.com"
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #333",
                backgroundColor: "#0f0f0f",
                color: "#fff",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ color: "#999" }}>Display name (optional)</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Optional"
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #333",
                backgroundColor: "#0f0f0f",
                color: "#fff",
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "grid", gap: "0.25rem" }}>
            <span style={{ color: "#999" }}>Your rating</span>
            <select
              value={ratingValue}
              onChange={(event) => setRatingValue(event.target.value)}
              style={{
                padding: "0.6rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #333",
                backgroundColor: "#0f0f0f",
                color: "#fff",
              }}
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleRatingSubmit}
            disabled={isSubmitting}
            style={{
              padding: "0.65rem 1.5rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save rating
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        <label style={{ display: "grid", gap: "0.25rem" }}>
          <span style={{ color: "#999" }}>Leave a comment</span>
          <textarea
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            rows={4}
            placeholder="Share your thoughts about this set..."
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #333",
              backgroundColor: "#0f0f0f",
              color: "#fff",
            }}
          />
        </label>
        <button
          type="button"
          onClick={handleCommentSubmit}
          disabled={isSubmitting}
          style={{
            padding: "0.65rem 1.5rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#16a34a",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Post comment
        </button>
      </div>

      {(statusMessage || errorMessage) && (
        <p style={{ marginTop: "1rem", color: errorMessage ? "#f87171" : "#4ade80" }}>
          {errorMessage ?? statusMessage}
        </p>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "0.75rem" }}>Recent comments</h3>
        {comments.length === 0 ? (
          <p style={{ color: "#666" }}>No comments yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{ paddingBottom: "0.75rem", borderBottom: "1px solid #222" }}>
                <div style={{ color: "#999", fontSize: "0.875rem" }}>
                  {comment.userDisplayName ?? "Anonymous"} ·{" "}
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
