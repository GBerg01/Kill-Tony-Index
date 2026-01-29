import Link from "next/link";

import type { Episode } from "@/lib/kt-index-data";

type EpisodeCardProps = {
  episode: Episode;
};

export const EpisodeCard = ({ episode }: EpisodeCardProps) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-kt-border bg-kt-card p-5 shadow-soft-glow">
    <div>
      <Link className="text-lg font-semibold text-white hover:text-white/80" href={`/episodes/${episode.id}`}>
        {episode.title}
      </Link>
      <p className="text-xs text-kt-muted">{episode.date}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      {episode.guests.map((guest) => (
        <span key={guest} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
          {guest}
        </span>
      ))}
    </div>
    <div className="text-xs text-kt-muted">
      {episode.performanceCount} performances indexed · Avg rating {episode.avgRating.toFixed(1)}
    </div>
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/episodes/${episode.id}`}
        className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
      >
        View performances
      </Link>
      <a
        href={episode.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
      >
        ▶ Watch full episode on YouTube
        <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">
          YouTube ↗
        </span>
      </a>
    </div>
  </div>
);
