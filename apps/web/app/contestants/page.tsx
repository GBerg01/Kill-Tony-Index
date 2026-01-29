import type { Contestant } from "@killtony/shared/src/types";

async function getContestants(): Promise<Contestant[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/contestants`, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  return json.data || [];
}

export default async function ContestantsPage() {
  const contestants = await getContestants();

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem" }}>Contestants</h1>

      {contestants.length === 0 ? (
        <p style={{ color: "#666" }}>No contestants found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {contestants.map((contestant) => (
            <a
              key={contestant.id}
              href={`/contestants/${contestant.id}`}
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
                {contestant.displayName}
              </h3>
              {contestant.aliases.length > 0 && (
                <p style={{ color: "#999", margin: 0, fontSize: "0.875rem" }}>
                  aka {contestant.aliases.join(", ")}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
