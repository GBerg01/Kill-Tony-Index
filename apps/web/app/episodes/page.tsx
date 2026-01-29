import type { Episode } from "@killtony/shared/src/types";

async function getEpisodes(): Promise<Episode[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/episodes`, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  return json.data || [];
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
    month: "short",
    day: "numeric",
  });
}

export default async function EpisodesPage() {
  const episodes = await getEpisodes();

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Episodes</h1>

      {episodes.length === 0 ? (
        <p style={{ color: "#666" }}>No episodes found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {episodes.map((episode) => (
            <a
              key={episode.id}
              href={`/episodes/${episode.id}`}
              style={{
                display: "block",
                padding: "1.25rem",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                border: "1px solid #333",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                {episode.title}
              </h3>
              <div style={{ display: "flex", gap: "1rem", color: "#999", fontSize: "0.875rem" }}>
                <span>{formatDate(episode.publishedAt)}</span>
                {episode.durationSeconds > 0 && (
                  <span>{formatDuration(episode.durationSeconds)}</span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
