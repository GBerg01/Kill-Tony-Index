type ReviewQueueItem = {
  id: string;
  episodeId: string;
  episodeTitle: string;
  youtubeUrl: string;
  contestantId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

const formatTimestamp = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const buildYouTubeLink = (url: string, startSeconds: number) => {
  if (!url) {
    return "";
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${startSeconds}s`;
};

async function getReviewQueue(): Promise<ReviewQueueItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/admin/review`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }
  const payload = await response.json();
  return payload.data || [];
}

export default async function ReviewQueuePage() {
  const queue = await getReviewQueue();

  return (
    <div>
      <h1 style={{ marginBottom: "0.5rem" }}>Admin Review Queue</h1>
      <p style={{ color: "#999", marginBottom: "2rem" }}>
        Review AI-extracted performances with lower confidence.
      </p>

      {queue.length === 0 ? (
        <p style={{ color: "#666" }}>No items waiting for review.</p>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {queue.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "1.25rem",
                backgroundColor: "#1a1a1a",
                borderRadius: "10px",
                border: "1px solid #333",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <h2 style={{ margin: "0 0 0.25rem 0" }}>{item.contestantName}</h2>
                  <p style={{ color: "#aaa", margin: 0 }}>{item.episodeTitle}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#888", fontSize: "0.875rem" }}>
                    Confidence: {(item.confidence * 100).toFixed(1)}%
                  </div>
                  <div style={{ color: "#888", fontSize: "0.875rem" }}>
                    Start: {formatTimestamp(item.startSeconds)}
                  </div>
                </div>
              </div>

              <p style={{ color: "#ccc", marginTop: "0.75rem" }}>{item.introSnippet}</p>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <a href={`/performances/${item.id}`} style={{ color: "#fff" }}>
                  View performance
                </a>
                <a href={`/contestants/${item.contestantId}`} style={{ color: "#fff" }}>
                  View contestant
                </a>
                {item.youtubeUrl && (
                  <a href={buildYouTubeLink(item.youtubeUrl, item.startSeconds)} style={{ color: "#fff" }}>
                    ▶ Watch full episode on YouTube · YouTube ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
