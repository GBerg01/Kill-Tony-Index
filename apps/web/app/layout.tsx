import type { Metadata } from "next";

import { AuthButton } from "./components/auth-button";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Kill Tony Index",
  description: "Searchable archive of Kill Tony contestants and performances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#0a0a0a", color: "#ededed" }}>
        <Providers>
          <header style={{ borderBottom: "1px solid #333", padding: "1rem 2rem" }}>
            <nav
              style={{
                display: "flex",
                gap: "2rem",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                <a
                  href="/"
                  style={{ color: "#ededed", textDecoration: "none", fontWeight: "bold", fontSize: "1.25rem" }}
                >
                  Kill Tony Index
                </a>
                <a href="/episodes" style={{ color: "#999", textDecoration: "none" }}>
                  Episodes
                </a>
                <a href="/contestants" style={{ color: "#999", textDecoration: "none" }}>
                  Contestants
                </a>
              </div>
              <AuthButton />
            </nav>
          </header>
          <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
