"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { TimestampButton } from "@/components/timestamp-button";
import { buildYouTubeEmbedUrl } from "@/lib/kt-index-data";
import type { Episode, Performance } from "@/lib/kt-index-data";

type EpisodeDetailClientProps = {
  episode: Episode;
  performances: Performance[];
};

export const EpisodeDetailClient = ({ episode, performances }: EpisodeDetailClientProps) => {
  const [selectedStart, setSelectedStart] = useState(performances[0]?.timestampSeconds ?? 0);

  const embedUrl = useMemo(() => buildYouTubeEmbedUrl(episode.youtubeUrl, selectedStart), [episode.youtubeUrl, selectedStart]);

  return (
    <div className="space-y-8">
      {embedUrl && (
        <div className="overflow-hidden rounded-2xl border border-kt-border bg-kt-card shadow-soft-glow">
          <iframe
            className="aspect-video w-full"
            src={embedUrl}
            title={`YouTube player for ${episode.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={episode.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-kt-border bg-kt-card px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
          >
            ▶ Watch Full Episode on YouTube
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              YouTube ↗
            </span>
          </a>
          <button className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
            Copy link
          </button>
        </div>
        <p className="text-sm text-kt-muted">
          Jump instantly. Select a performance to update the player start time.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Episode index</h2>
        <div className="grid gap-4">
          {performances.map((performance) => (
            <div
              key={performance.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-kt-border bg-kt-card p-4 transition hover:border-white/30"
              onClick={() => setSelectedStart(performance.timestampSeconds)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setSelectedStart(performance.timestampSeconds);
                }
              }}
            >
              <div>
                <Link
                  href={`/performances/${performance.id}`}
                  className="text-lg font-semibold text-white hover:text-white/80"
                >
                  {performance.contestantName}
                </Link>
                <p className="text-xs text-kt-muted">{performance.snippet}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <TimestampButton
                  href={performance.youtubeJumpUrl}
                  label={`⏱ Jump to ${performance.timestampLabel}`}
                />
                <span className="text-xs text-kt-muted">Opens YouTube at the exact timestamp.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
