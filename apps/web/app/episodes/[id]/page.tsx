import type { Episode } from "@killtony/shared/src/types";

type PerformanceWithContestant = {
  id: string;
  episodeId: string;
  contestantId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

type EpisodeDetailResponse = {
  data: {
    episode: Episode;
    performances: PerformanceWithContestant[];
  };
  error?: { message: string; code: string };
};

async function getEpisode(id: string): Promise<EpisodeDetailResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/episodes/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatDate(dateString: string): string {
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

function getYouTubeTimestampUrl(youtubeUrl: string, startSeconds: number): string {
  const url = new URL(youtubeUrl);
  url.searchParams.set("t", startSeconds.toString());
  return url.toString();
}

export default async function EpisodeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getEpisode(params.id);

  if (!result || !result.data) {
    return (
      <div>
        <h1>Episode Not Found</h1>
        <p style={{ color: "#999" }}>The episode you're looking for doesn't exist.</p>
        <a href="/episodes" style={{ color: "#3b82f6" }}>← Back to episodes</a>
      </div>
    );
  }

  const { episode, performances } = result.data;

  return (
    <div>
      <a href="/episodes" style={{ color: "#999", textDecoration: "none", fontSize: "0.875rem" }}>
        ← Back to episodes
      </a>

      <h1 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>{episode.title}</h1>

      <div style={{ display: "flex", gap: "1.5rem", color: "#999", marginBottom: "1.5rem" }}>
        <span>{formatDate(episode.publishedAt)}</span>
        {episode.durationSeconds > 0 && <span>{formatDuration(episode.durationSeconds)}</span>}
      </div>

      <a
        href={episode.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#dc2626",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: 500,
          marginBottom: "2rem",
        }}
      >
        Watch on YouTube
      </a>

      <h2 style={{ marginBottom: "1rem" }}>Performances ({performances.length})</h2>

      {performances.length === 0 ? (
        <p style={{ color: "#666" }}>No performances have been indexed for this episode yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {performances.map((performance) => (
            <div
              key={performance.id}
              style={{
                padding: "1.25rem",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                border: "1px solid #333",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <a
                  href={`/contestants/${performance.contestantId}`}
                  style={{ color: "#ededed", textDecoration: "none", fontWeight: 500, fontSize: "1.1rem" }}
                >
                  {performance.contestantName}
                </a>
                <a
                  href={getYouTubeTimestampUrl(episode.youtubeUrl, performance.startSeconds)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "0.375rem 0.75rem",
                    backgroundColor: "#333",
                    color: "#ededed",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                  }}
                >
                  {formatTimestamp(performance.startSeconds)}
                </a>
              </div>

              {performance.introSnippet && (
                <p style={{ color: "#999", margin: 0, fontSize: "0.9rem" }}>
                  {performance.introSnippet}
                </p>
              )}

              <div style={{ marginTop: "0.75rem" }}>
                <a
                  href={`/performances/${performance.id}`}
                  style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.875rem" }}
                >
                  View details →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
