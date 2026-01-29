import Link from "next/link";

import type { Performance } from "@/lib/kt-index-data";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { TimestampButton } from "@/components/timestamp-button";

type PerformanceCardProps = {
  performance: Performance;
};

export const PerformanceCard = ({ performance }: PerformanceCardProps) => (
  <div className="flex h-full min-w-[320px] flex-col justify-between rounded-2xl border border-kt-border bg-kt-card p-5 shadow-soft-glow">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link
            className="text-lg font-semibold text-white hover:text-white/80"
            href={`/performances/${performance.id}`}
          >
            {performance.contestantName}
          </Link>
          <p className="text-xs text-kt-muted">
            Kill Tony #{performance.episodeNumber} · {performance.episodeTitle}
          </p>
        </div>
        <ConfidenceBadge level={performance.confidence} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-kt-muted">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60">Rating</p>
          <p className="text-sm font-semibold text-white">
            {performance.ratingAvg.toFixed(1)} · {performance.ratingCount} votes
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60">Comments</p>
          <p className="text-sm font-semibold text-white">{performance.commentCount} threads</p>
        </div>
      </div>

      <p className="text-sm text-kt-muted">{performance.snippet}</p>
    </div>

    <div className="mt-5 space-y-3">
      <TimestampButton href={performance.youtubeJumpUrl} label={`⏱ Jump to ${performance.timestampLabel}`} />
      <p className="text-xs text-kt-muted">Opens YouTube at the exact timestamp.</p>
      <a
        href={performance.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white"
      >
        ▶ Watch full episode on YouTube
        <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
          YouTube ↗
        </span>
      </a>
    </div>
  </div>
);
