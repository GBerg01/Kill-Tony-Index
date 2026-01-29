import type { ContestantDetail } from "@killtony/shared/src/types";

type PerformanceWithEpisode = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  episodePublishedAt: string;
  youtubeUrl: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
  averageRating: number;
  ratingCount: number;
};

type ContestantDetailResponse = {
  data: {
    contestant: ContestantDetail;
    performances: PerformanceWithEpisode[];
  };
  error?: { message: string; code: string };
};

async function getContestant(id: string): Promise<ContestantDetailResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/contestants/${id}`, { cache: "no-store" });
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
    month: "short",
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
  if (!youtubeUrl) return "#";
  const url = new URL(youtubeUrl);
  url.searchParams.set("t", startSeconds.toString());
  return url.toString();
}

export default async function ContestantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getContestant(params.id);

  if (!result || !result.data) {
    return (
      <div>
        <h1>Contestant Not Found</h1>
        <p style={{ color: "#999" }}>The contestant you're looking for doesn't exist.</p>
        <a href="/contestants" style={{ color: "#3b82f6" }}>← Back to contestants</a>
      </div>
    );
  }

  const { contestant, performances } = result.data;

  const socialLinks = [
    { label: "Instagram", url: contestant.instagramUrl },
    { label: "YouTube", url: contestant.youtubeUrl },
    { label: "Website", url: contestant.websiteUrl },
    { label: "Tickets", url: contestant.ticketUrl },
  ].filter((link) => link.url);

  return (
    <div>
      <a href="/contestants" style={{ color: "#999", textDecoration: "none", fontSize: "0.875rem" }}>
        ← Back to contestants
      </a>

      <h1 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>{contestant.displayName}</h1>

      {contestant.aliases.length > 0 && (
        <p style={{ color: "#999", marginBottom: "1rem" }}>
          Also known as: {contestant.aliases.join(", ")}
        </p>
      )}

      {socialLinks.length > 0 && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#333",
                color: "#ededed",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "0.875rem",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <h2 style={{ marginBottom: "1rem" }}>Appearances ({performances.length})</h2>

      {performances.length === 0 ? (
        <p style={{ color: "#666" }}>No appearances have been indexed for this contestant yet.</p>
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
                <div>
                  <a
                    href={`/episodes/${performance.episodeId}`}
                    style={{ color: "#ededed", textDecoration: "none", fontWeight: 500, fontSize: "1.1rem" }}
                  >
                    {performance.episodeTitle}
                  </a>
                  <div style={{ color: "#999", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {formatDate(performance.episodePublishedAt)}
                  </div>
                </div>
                <a
                  href={getYouTubeTimestampUrl(performance.youtubeUrl, performance.startSeconds)}
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

              <div style={{ marginTop: "0.75rem", color: "#888", fontSize: "0.85rem" }}>
                Avg rating: {performance.averageRating.toFixed(1)} · {performance.ratingCount} ratings
              </div>

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
