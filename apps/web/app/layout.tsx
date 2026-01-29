import type { Metadata } from "next";

import "@/app/globals.css";

import Providers from "./providers";
import { NavBar } from "@/components/nav-bar";

export const metadata: Metadata = {
  title: "Kill Tony Index",
  description: "The Kill Tony moment index — jump to any set instantly on YouTube.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <NavBar />
          <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
