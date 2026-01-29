type LeaderboardEntry = {
  contestantId: string;
  contestantName: string;
  averageRating: number;
  performanceCount: number;
  totalVotes: number;
};

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/leaderboards`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }
  const payload = await response.json();
  return payload.data || [];
}

export default async function LeaderboardsPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div>
      <h1 style={{ marginBottom: "0.5rem" }}>Leaderboards</h1>
      <p style={{ color: "#999", marginBottom: "2rem" }}>
        Ranked by average rating across each contestant&apos;s performances.
      </p>

      {leaderboard.length === 0 ? (
        <p style={{ color: "#666" }}>No leaderboard data available yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {leaderboard.map((entry, index) => (
            <div
              key={entry.contestantId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                border: "1px solid #333",
              }}
            >
              <div>
                <div style={{ color: "#777", fontSize: "0.875rem" }}>#{index + 1}</div>
                <a
                  href={`/contestants/${entry.contestantId}`}
                  style={{ color: "#ededed", textDecoration: "none", fontSize: "1.1rem" }}
                >
                  {entry.contestantName}
                </a>
                <div style={{ color: "#888", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  {entry.performanceCount} performances · {entry.totalVotes} ratings
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 600 }}>
                  {entry.averageRating.toFixed(1)}
                </div>
                <div style={{ color: "#888", fontSize: "0.875rem" }}>avg rating</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
