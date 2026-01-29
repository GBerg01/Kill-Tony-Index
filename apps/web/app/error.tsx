"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Something went wrong</h1>
      <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
        We hit a snag while loading this page. Try again, or come back in a bit.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: "0.6rem 1.2rem",
          borderRadius: "6px",
          border: "1px solid #333",
          backgroundColor: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
      {error?.digest ? (
        <p style={{ marginTop: "1rem", color: "#6b7280", fontSize: "0.85rem" }}>
          Error reference: {error.digest}
        </p>
      ) : null}
    </main>
  );
}
