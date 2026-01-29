import { ContestantCard } from "@/components/contestant-card";
import { EpisodeCard } from "@/components/episode-card";
import { GlobalSearchBar } from "@/components/global-search-bar";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { PerformanceCard } from "@/components/performance-card";
import { contestants, episodes, leaderboardRows, performances } from "@/lib/kt-index-data";

export default async function HomePage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-kt-muted">
          Speed-first moment index
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Kill Tony Index</h1>
          <p className="text-lg text-kt-muted">
            The Kill Tony moment index — jump to any performance instantly on YouTube.
          </p>
        </div>
        <div className="max-w-2xl space-y-3">
          <GlobalSearchBar className="w-full" inputClassName="min-w-[280px]" />
          <p className="text-sm text-kt-muted">
            Results open directly at the exact timestamp on YouTube. Jump instantly. No scrubbing.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["🔥 Top performances", "🎲 Random performance", "📅 Latest episode", "🏆 Leaderboard"].map((label) => (
            <button
              key={label}
              className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Trending performances</h2>
            <p className="text-sm text-kt-muted">Skip to the exact set in one click.</p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {performances.slice(0, 4).map((performance) => (
            <PerformanceCard key={performance.id} performance={performance} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Latest indexed episodes</h2>
            <p className="text-sm text-kt-muted">Structured metadata, built for speed.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Top contestants</h2>
            <p className="text-sm text-kt-muted">Find their best set instantly.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {contestants.slice(0, 6).map((contestant, index) => (
            <ContestantCard
              key={contestant.id}
              contestant={contestant}
              bestPerformance={performances.find((performance) => performance.id === contestant.bestPerformanceId)}
              isTrending={index < 2}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Leaderboard preview</h2>
            <p className="text-sm text-kt-muted">Jump instantly to top-rated moments.</p>
          </div>
          <div className="flex gap-2">
            {["Week", "Month", "All-time"].map((label) => (
              <button
                key={label}
                className="rounded-full border border-kt-border bg-kt-card px-3 py-1 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <LeaderboardTable rows={leaderboardRows.slice(0, 5)} />
      </section>
    </div>
  );
}
