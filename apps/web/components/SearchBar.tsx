"use client";

import { useState, useEffect, useRef } from "react";

type SearchResult = {
  type: "episode" | "contestant";
  id: string;
  title: string;
  subtitle: string | null;
  matchedOn: string;
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
        const json = await res.json();
        setResults(json.data || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const getResultUrl = (result: SearchResult) => {
    return result.type === "episode"
      ? `/episodes/${result.id}`
      : `/contestants/${result.id}`;
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder="Search episodes, contestants..."
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          backgroundColor: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "8px",
          color: "#ededed",
          fontSize: "1rem",
          outline: "none",
        }}
      />

      {isLoading && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#666",
            fontSize: "0.875rem",
          }}
        >
          ...
        </div>
      )}

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 50,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {results.map((result) => (
            <a
              key={`${result.type}-${result.id}`}
              href={getResultUrl(result)}
              style={{
                display: "block",
                padding: "0.75rem 1rem",
                color: "#ededed",
                textDecoration: "none",
                borderBottom: "1px solid #333",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#252525")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{result.title}</div>
                  {result.subtitle && (
                    <div style={{ color: "#999", fontSize: "0.875rem" }}>
                      Matched alias: {result.subtitle}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    backgroundColor: result.type === "episode" ? "#1e3a5f" : "#3f1e5f",
                    borderRadius: "4px",
                    color: "#ededed",
                  }}
                >
                  {result.type}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && !isLoading && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            padding: "1rem",
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#666",
            textAlign: "center",
          }}
        >
          No results found
        </div>
      )}
    </div>
  );
}
