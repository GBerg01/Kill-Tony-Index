import type { Metadata } from "next";
import Script from "next/script";

import "@/app/globals.css";

import Providers from "./providers";

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
      <body>
        <Providers>
          <Script
            src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"
            strategy="beforeInteractive"
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
