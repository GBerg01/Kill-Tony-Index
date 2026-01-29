"use client";

import { useEffect, useMemo, useState } from "react";

type SearchEpisodeResult = {
  id: string;
  title: string;
  publishedAt: string | null;
  youtubeUrl: string;
};

type SearchContestantResult = {
  id: string;
  displayName: string;
  aliases: string[];
};

type SearchResponse = {
  query: string;
  episodes: SearchEpisodeResult[];
  contestants: SearchContestantResult[];
  error?: { message: string; code: string };
};

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedQuery = useMemo(() => query.trim(), [query]);
  const canSearch = trimmedQuery.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!canSearch) {
      setResults(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(trimmedQuery)}&limit=5`,
          { signal: controller.signal }
        );
        const data = (await res.json()) as SearchResponse;
        if (!res.ok) {
          setError(data.error?.message || "Search failed");
          setResults(null);
        } else {
          setResults(data);
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError("Search failed");
          setResults(null);
        }
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [canSearch, trimmedQuery]);

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ marginBottom: "0.75rem" }}>Search</h2>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search episodes or contestants"
          aria-label="Search episodes or contestants"
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#121212",
            color: "#f5f5f5",
          }}
        />
        <span style={{ color: "#888", fontSize: "0.875rem", minWidth: "80px" }} role="status">
          {isLoading ? "Searching..." : " "}
        </span>
      </div>
      <p style={{ color: "#777", marginTop: "0.5rem", marginBottom: "1rem" }}>
        Try at least {MIN_QUERY_LENGTH} characters to search episodes and contestants.
      </p>

      {error && (
        <p style={{ color: "#ff7a7a", marginBottom: "1rem" }}>{error}</p>
      )}

      {!canSearch ? null : results ? (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <h3 style={{ marginBottom: "0.5rem" }}>Episodes</h3>
            {results.episodes.length === 0 ? (
              <p style={{ color: "#666" }}>No episodes match "{results.query}".</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {results.episodes.map((episode) => (
                  <li key={episode.id} style={{ marginBottom: "0.5rem" }}>
                    <a href={`/episodes/${episode.id}`} style={{ color: "#fff" }}>
                      {episode.title}
                    </a>
                    {episode.publishedAt && (
                      <span style={{ marginLeft: "0.5rem", color: "#888", fontSize: "0.875rem" }}>
                        {new Date(episode.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 style={{ marginBottom: "0.5rem" }}>Contestants</h3>
            {results.contestants.length === 0 ? (
              <p style={{ color: "#666" }}>No contestants match "{results.query}".</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {results.contestants.map((contestant) => (
                  <li key={contestant.id} style={{ marginBottom: "0.5rem" }}>
                    <a href={`/contestants/${contestant.id}`} style={{ color: "#fff" }}>
                      {contestant.displayName}
                    </a>
                    {contestant.aliases.length > 0 && (
                      <div style={{ color: "#888", fontSize: "0.85rem" }}>
                        Aliases: {contestant.aliases.join(", ")}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : isLoading ? (
        <p style={{ color: "#666" }}>Searching for "{trimmedQuery}"...</p>
      ) : (
        <p style={{ color: "#666" }}>Start typing to see results.</p>
      )}
    </section>
  );
}
