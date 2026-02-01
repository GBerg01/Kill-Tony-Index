import Link from "next/link";

import { PerformanceCard } from "@/components/performance-card";
import type { Performance } from "@/lib/kt-index-data";

type PerformancesResponse = {
  data: Performance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

async function getPerformances(page: number = 1, limit: number = 20): Promise<PerformancesResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/performances?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  return res.json();
}

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PerformancesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const { data: performances, pagination } = await getPerformances(currentPage);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Performances index</h1>
        <p className="text-sm text-kt-muted">
          Find the exact Kill Tony moment you want in 2 clicks. Jump instantly — no scrubbing.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {["All moments", "Highest rated", "Most discussed", "Low confidence"].map((label) => (
          <button
            key={label}
            className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {performances.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-kt-border bg-kt-card/50 py-16 text-center">
          <div className="mb-4 text-4xl opacity-50">🎤</div>
          <h3 className="mb-2 text-lg font-medium text-white">No performances yet</h3>
          <p className="max-w-md text-sm text-kt-muted">
            Run the worker to populate the database with Kill Tony episode data and extracted
            performances.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {performances.map((performance) => (
              <PerformanceCard key={performance.id} performance={performance} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-4">
              {currentPage > 1 && (
                <Link
                  href={`/performances?page=${currentPage - 1}`}
                  className="rounded-lg border border-kt-border bg-kt-card px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-kt-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {currentPage < pagination.totalPages && (
                <Link
                  href={`/performances?page=${currentPage + 1}`}
                  className="rounded-lg border border-kt-border bg-kt-card px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                >
                  Next
                </Link>
              )}
            </nav>
          )}

          <p className="text-center text-xs text-kt-muted">
            Showing {performances.length} of {pagination.total} performances
          </p>
        </>
      )}
    </div>
  );
}
