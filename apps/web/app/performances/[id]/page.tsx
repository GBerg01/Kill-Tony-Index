import { FeedbackPanel } from "@/app/components/performances/feedback-panel";

type PerformanceDetail = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  episodePublishedAt: string;
  youtubeUrl: string;
  contestantId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

type PerformanceDetailResponse = {
  data: PerformanceDetail;
  error?: { message: string; code: string };
};

async function getPerformance(id: string): Promise<PerformanceDetailResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/performances/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatDuration(startSeconds: number, endSeconds: number | null): string {
  if (!endSeconds) return "";
  const duration = endSeconds - startSeconds;
  const minutes = Math.floor(duration / 60);
  const secs = duration % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function getYouTubeTimestampUrl(youtubeUrl: string, startSeconds: number): string {
  if (!youtubeUrl) return "#";
  const url = new URL(youtubeUrl);
  url.searchParams.set("t", startSeconds.toString());
  return url.toString();
}

export default async function PerformanceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getPerformance(params.id);

  if (!result || !result.data) {
    return (
      <div>
        <h1>Performance Not Found</h1>
        <p style={{ color: "#999" }}>The performance you're looking for doesn't exist.</p>
        <a href="/" style={{ color: "#3b82f6" }}>← Back to home</a>
      </div>
    );
  }

  const performance = result.data;
  const youtubeTimestampUrl = getYouTubeTimestampUrl(performance.youtubeUrl, performance.startSeconds);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <a href={`/episodes/${performance.episodeId}`} style={{ color: "#999", textDecoration: "none", fontSize: "0.875rem" }}>
          ← Back to {performance.episodeTitle}
        </a>
      </div>

      <h1 style={{ marginBottom: "0.5rem" }}>
        <a
          href={`/contestants/${performance.contestantId}`}
          style={{ color: "#ededed", textDecoration: "none" }}
        >
          {performance.contestantName}
        </a>
      </h1>

      <p style={{ color: "#999", marginBottom: "1.5rem" }}>
        Performance on{" "}
        <a
          href={`/episodes/${performance.episodeId}`}
          style={{ color: "#3b82f6", textDecoration: "none" }}
        >
          {performance.episodeTitle}
        </a>
        {" · "}
        {formatDate(performance.episodePublishedAt)}
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <a
          href={youtubeTimestampUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#dc2626",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: 500,
          }}
        >
          Watch on YouTube at {formatTimestamp(performance.startSeconds)}
        </a>
      </div>

      <div
        style={{
          padding: "1.5rem",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid #333",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.1rem" }}>Performance Details</h2>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.75rem 1.5rem" }}>
          <span style={{ color: "#999" }}>Start Time:</span>
          <span style={{ fontFamily: "monospace" }}>{formatTimestamp(performance.startSeconds)}</span>

          {performance.endSeconds && (
            <>
              <span style={{ color: "#999" }}>End Time:</span>
              <span style={{ fontFamily: "monospace" }}>{formatTimestamp(performance.endSeconds)}</span>

              <span style={{ color: "#999" }}>Duration:</span>
              <span>{formatDuration(performance.startSeconds, performance.endSeconds)}</span>
            </>
          )}

          <span style={{ color: "#999" }}>Confidence:</span>
          <span>{(performance.confidence * 100).toFixed(1)}%</span>
        </div>

        {performance.introSnippet && (
          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "#999" }}>
              Intro Snippet
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{performance.introSnippet}</p>
          </div>
        )}
      </div>

      <FeedbackPanel performanceId={performance.id} />
    </div>
  );
}
