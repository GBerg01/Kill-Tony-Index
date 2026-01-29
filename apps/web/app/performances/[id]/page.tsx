import type { Metadata } from "next";

import { ConfidenceBadge } from "@/components/confidence-badge";
import { PerformanceCard } from "@/components/performance-card";
import { RatingStarsOrSlider } from "@/components/rating-slider";
import { ShareButtons } from "@/components/share-buttons";
import { Snippet } from "@/components/snippet";
import { TimestampButton } from "@/components/timestamp-button";
import {
  getContestantById,
  getEpisodeById,
  getPerformanceById,
  getPerformancesByContestant,
  getPerformancesByEpisode,
} from "@/lib/kt-index-data";

export default async function PerformanceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const performance = getPerformanceById(params.id);

  if (!performance) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Performance Not Found</h1>
        <p className="text-sm text-kt-muted">The performance you're looking for doesn't exist.</p>
        <a href="/" className="text-sm text-white/80 hover:text-white">
          ← Back to home
        </a>
      </div>
    );
  }

  const episode = getEpisodeById(performance.episodeId);
  const contestant = getContestantById(performance.contestantId);
  const moreFromContestant = getPerformancesByContestant(performance.contestantId).filter(
    (item) => item.id !== performance.id,
  );
  const moreFromEpisode = getPerformancesByEpisode(performance.episodeId).filter(
    (item) => item.id !== performance.id,
  );

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <a href={`/episodes/${performance.episodeId}`} className="text-sm text-kt-muted hover:text-white">
          ← Back to episode #{performance.episodeNumber}
        </a>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-white">{contestant?.name ?? performance.contestantName}</h1>
          <ConfidenceBadge level={performance.confidence} />
        </div>
        <p className="text-sm text-kt-muted">
          Scene page for Kill Tony #{performance.episodeNumber} · {episode?.title ?? performance.episodeTitle} ·{" "}
          {performance.timestampLabel}
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-kt-border bg-kt-card p-6 shadow-soft-glow">
        <div className="flex flex-wrap items-center gap-4">
          <TimestampButton href={performance.youtubeJumpUrl} label="⏱ Jump to moment (YouTube)" />
          <p className="text-xs text-kt-muted">Opens YouTube at the exact timestamp.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-kt-muted">
          <span>Rating {performance.ratingAvg.toFixed(1)}</span>
          <span>{performance.ratingCount} votes</span>
          <span>{performance.commentCount} comments</span>
          <span>Jump instantly — no scrubbing.</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-kt-border bg-kt-card p-6 shadow-soft-glow">
            <h2 className="text-xl font-semibold text-white">Transcript snippet</h2>
            <div className="mt-4">
              <Snippet text={performance.snippet} />
            </div>
          </div>

          <div className="rounded-2xl border border-kt-border bg-kt-card p-6 shadow-soft-glow">
            <h2 className="text-xl font-semibold text-white">Comments</h2>
            <div className="mt-4 space-y-4 text-sm text-kt-muted">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                “That callback at the end was flawless. Jump instantly to the punchline.”
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                “Perfect crowd control — no scrubbing needed.”
              </div>
              <button className="text-xs font-semibold text-white/80 hover:text-white">
                View full thread →
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RatingStarsOrSlider />
          <div className="rounded-2xl border border-kt-border bg-kt-card p-6 shadow-soft-glow">
            <h2 className="text-xl font-semibold text-white">Share this moment</h2>
            <p className="mt-2 text-sm text-kt-muted">
              Share the scene page or copy the exact YouTube timestamp.
            </p>
            <div className="mt-4">
              <ShareButtons performance={performance} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">More from this contestant</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {moreFromContestant.slice(0, 2).map((item) => (
            <PerformanceCard key={item.id} performance={item} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">More performances in this episode</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {moreFromEpisode.slice(0, 2).map((item) => (
            <PerformanceCard key={item.id} performance={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const performance = getPerformanceById(params.id);
  if (!performance) {
    return {
      title: "Performance not found",
    };
  }

  return {
    title: `${performance.contestantName} — Kill Tony #${performance.episodeNumber}`,
    description: `${performance.timestampLabel} · Rated ${performance.ratingAvg.toFixed(1)} · ${performance.snippet}`,
    openGraph: {
      title: `${performance.contestantName} — Kill Tony #${performance.episodeNumber}`,
      description: `${performance.timestampLabel} · Rated ${performance.ratingAvg.toFixed(1)} · ${performance.snippet}`,
    },
  };
}
