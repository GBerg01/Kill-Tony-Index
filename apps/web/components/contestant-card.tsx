import Link from "next/link";

import type { Contestant, Performance } from "@/lib/kt-index-data";

type ContestantCardProps = {
  contestant: Contestant;
  bestPerformance?: Performance | null;
  isTrending?: boolean;
};

export const ContestantCard = ({ contestant, bestPerformance, isTrending }: ContestantCardProps) => (
  <div className="rounded-2xl border border-kt-border bg-kt-card p-5 shadow-soft-glow">
    <div className="flex items-start justify-between">
      <div>
        <Link className="text-lg font-semibold text-white hover:text-white/80" href={`/contestants/${contestant.id}`}>
          {contestant.name}
        </Link>
        <p className="text-xs text-kt-muted">{contestant.appearances} appearances</p>
      </div>
      {isTrending && (
        <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-rose-200">
          Trending
        </span>
      )}
    </div>
    <div className="mt-4 text-sm text-white">
      Avg rating <span className="font-semibold">{contestant.avgRating.toFixed(1)}</span>
    </div>
    {bestPerformance && (
      <Link
        href={`/performances/${bestPerformance.id}`}
        className="mt-3 inline-flex text-xs font-semibold text-kt-muted transition hover:text-white"
      >
        Best set → {bestPerformance.timestampLabel}
      </Link>
    )}
  </div>
);
