"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <span style={{ color: "#999", fontSize: "0.9rem" }}>
        Checking session...
      </span>
    );
  }

  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={() => signIn("github")}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "1px solid #444",
          backgroundColor: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Sign in
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <span style={{ color: "#ddd", fontSize: "0.9rem" }}>
        {session.user.name ?? session.user.email ?? "Signed in"}
      </span>
      <button
        type="button"
        onClick={() => signOut()}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "1px solid #444",
          backgroundColor: "#1f2937",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  );
}
