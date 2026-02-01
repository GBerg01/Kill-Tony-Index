import Link from "next/link";

type ConfidenceLevel = "High" | "Medium" | "Low";

type TrendingPerformance = {
  id: string;
  contestantName: string;
  episodeNumber: number;
  episodeTitle: string;
  ratingAvg: number;
  ratingCount: number;
  commentCount: number;
  snippet: string;
  confidence: ConfidenceLevel;
  youtubeUrl: string;
  youtubeJumpUrl: string;
};

type Episode = {
  id: string;
  title: string;
  publishedAt: string;
  youtubeUrl: string;
  episodeNumber?: number;
};

type LeaderboardEntry = {
  contestantId: string;
  contestantName: string;
  averageRating: number;
  performanceCount: number;
  totalVotes: number;
};

type Contestant = {
  id: string;
  displayName: string;
  performanceCount?: number;
  averageRating?: number;
};

async function getTrendingPerformances(): Promise<TrendingPerformance[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/performances/trending?limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getLatestEpisodes(): Promise<Episode[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/episodes?limit=2`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getTopContestants(): Promise<LeaderboardEntry[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/leaderboards?limit=2`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/leaderboards?limit=3`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function HomePage() {
  const [trendingPerformances, latestEpisodes, topContestants, leaderboard] = await Promise.all([
    getTrendingPerformances(),
    getLatestEpisodes(),
    getTopContestants(),
    getLeaderboard(),
  ]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-red-600/30">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0f0f0f]/80 px-4 py-3 backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-3xl font-display tracking-wider uppercase">
                Kill Tony <span className="text-[#cc0000]">Index</span>
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-zinc-400 lg:flex">
              <Link href="/episodes" className="transition-colors hover:text-white">
                Episodes
              </Link>
              <Link href="/contestants" className="transition-colors hover:text-white">
                Contestants
              </Link>
              <Link href="/performances" className="transition-colors hover:text-white">
                Performances
              </Link>
              <Link href="/leaderboard" className="transition-colors hover:text-white">
                Leaderboard
              </Link>
              <Link href="/guests" className="transition-colors hover:text-white">
                Guests
              </Link>
            </div>
          </div>
          <div className="relative hidden max-w-md flex-1 group md:block">
            <iconify-icon
              icon="lucide:search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#cc0000]"
            ></iconify-icon>
            <input
              type="text"
              placeholder="Search moments, names, or guests..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm transition-all focus:border-[#cc0000] focus:outline-none focus:ring-1 focus:ring-[#cc0000]"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-zinc-300" type="button">
              Sign in
            </button>
            <button className="btn-primary flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold" type="button">
              Submit Moment
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-20 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-5xl -translate-x-1/2 rounded-full bg-[#cc0000]/5 blur-[120px]"></div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-6xl font-display leading-none tracking-wide lg:text-9xl">
              Jump to any performance <span className="text-[#cc0000]">instantly</span>.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-zinc-400">
              The Kill Tony moment index — the community-powered way to find the exact set you want in 2 clicks on
              YouTube.
            </p>
            <div className="group relative mx-auto mb-6 max-w-2xl">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#cc0000] to-orange-600 blur opacity-25 transition duration-1000 group-hover:opacity-40 group-hover:duration-200"></div>
              <div className="relative flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search contestant, episode #, or keyword..."
                  className="flex-1 rounded-xl border border-white/10 bg-zinc-900 px-6 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
                />
                <button
                  className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-8 py-5 font-bold"
                  type="button"
                >
                  <iconify-icon icon="lucide:zap"></iconify-icon> Search Index
                </button>
              </div>
            </div>
            <p className="mb-10 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Results open directly at the exact timestamp on YouTube • No scrubbing
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/performances"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
              >
                <iconify-icon icon="lucide:flame" className="text-orange-500"></iconify-icon> Top Performances
              </Link>
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
                type="button"
              >
                <iconify-icon icon="lucide:dices" className="text-blue-400"></iconify-icon> Random Set
              </button>
              <Link
                href="/episodes"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
              >
                <iconify-icon icon="lucide:calendar" className="text-emerald-400"></iconify-icon> Latest Episode
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
              >
                <iconify-icon icon="lucide:trophy" className="text-yellow-500"></iconify-icon> Leaderboard
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-[#cc0000]"></div>
              <h2 className="text-4xl font-display tracking-wider">Trending Performances</h2>
            </div>
            <Link href="/performances" className="flex items-center gap-2 font-bold text-[#cc0000] hover:underline">
              View all <iconify-icon icon="lucide:chevron-right"></iconify-icon>
            </Link>
          </div>
          {trendingPerformances.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/50 py-16 text-center">
              <div className="mb-4 text-4xl opacity-50">🎤</div>
              <h3 className="mb-2 text-lg font-medium">No performances yet</h3>
              <p className="max-w-md text-sm text-zinc-500">
                Run the worker to populate the database with Kill Tony episode data.
              </p>
            </div>
          ) : (
            <div className="custom-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-6">
              {trendingPerformances.map((card) => (
                <div
                  key={card.id}
                  className="glow-red flex min-w-[340px] flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        card.confidence === "High" ? "badge-confidence-high" : "badge-confidence-medium"
                      }`}
                    >
                      <iconify-icon icon={card.confidence === "High" ? "lucide:shield-check" : "lucide:info"}></iconify-icon>
                      Confidence: {card.confidence}
                    </div>
                    <span className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                      YOUTUBE <iconify-icon icon="lucide:external-link"></iconify-icon>
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-2xl font-display tracking-wider">{card.contestantName}</h3>
                    <p className="text-sm font-medium text-zinc-500">Episode #{card.episodeNumber}</p>
                  </div>
                  <div className="flex items-center gap-4 border-y border-white/5 py-2">
                    <div className="flex items-center gap-1 text-[#cc0000]">
                      <iconify-icon icon="lucide:star" className="fill-current"></iconify-icon>
                      <span className="font-bold">{card.ratingAvg.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{card.ratingCount} votes</span>
                    <div className="ml-auto flex items-center gap-1 text-zinc-400">
                      <iconify-icon icon="lucide:message-square"></iconify-icon>
                      <span className="text-xs">{card.commentCount}</span>
                    </div>
                  </div>
                  <p className="snippet-clamp text-sm italic text-zinc-400">{card.snippet || "Performance snippet"}</p>
                  <div className="mt-auto flex flex-col gap-2">
                    <a
                      href={card.youtubeJumpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full rounded-xl py-3 font-bold text-center"
                    >
                      ⏱ Jump to moment (YouTube)
                    </a>
                    <a
                      href={card.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full rounded-xl py-3 text-sm font-bold text-zinc-300 text-center"
                    >
                      ▶ Watch full episode
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-12 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <div className="mb-8 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-2 rounded-full bg-[#cc0000]"></div>
                <h2 className="text-3xl font-display tracking-wider">Latest Episodes</h2>
              </div>
              <Link href="/episodes" className="text-sm font-bold text-zinc-400 hover:text-white">
                Browse History
              </Link>
            </div>
            {latestEpisodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-zinc-900 py-12 text-center">
                <div className="mb-3 text-3xl opacity-50">📺</div>
                <p className="text-sm text-zinc-500">No episodes yet. Run the worker to populate data.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {latestEpisodes.map((episode) => (
                  <div key={episode.id} className="flex flex-col gap-4 rounded-xl border border-white/5 bg-zinc-900 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-2xl font-display tracking-wider">{episode.title}</h4>
                        <p className="text-xs text-zinc-500">Released {formatDate(episode.publishedAt)}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Link
                        href={`/episodes/${episode.id}`}
                        className="flex-1 rounded-lg bg-zinc-800 py-2 text-xs font-bold text-center transition-colors hover:bg-zinc-700"
                      >
                        View Performances
                      </Link>
                      <a
                        href={episode.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-[#cc0000]/10 px-3 py-2 text-xs font-bold text-[#cc0000] transition-colors hover:bg-[#cc0000]/20"
                      >
                        <iconify-icon icon="lucide:youtube"></iconify-icon>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-8 w-2 rounded-full bg-[#cc0000]"></div>
                <h2 className="text-3xl font-display tracking-wider">Top Contestants</h2>
              </div>
              {topContestants.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-zinc-900 py-12 text-center">
                  <div className="mb-3 text-3xl opacity-50">🎭</div>
                  <p className="text-sm text-zinc-500">No contestant data yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {topContestants.map((contestant) => (
                    <Link
                      key={contestant.contestantId}
                      href={`/contestants/${contestant.contestantId}`}
                      className="flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-900 p-5 transition-colors hover:border-white/10"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 font-bold text-zinc-500">
                        {getInitials(contestant.contestantName)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-display tracking-wide">{contestant.contestantName}</h4>
                        <p className="text-[10px] uppercase text-zinc-500">
                          {contestant.performanceCount} sets • {contestant.averageRating.toFixed(1)} Avg
                        </p>
                      </div>
                      <iconify-icon icon="lucide:chevron-right" className="text-zinc-600"></iconify-icon>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/5 bg-zinc-900/30 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display tracking-wider">Leaderboard</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">All-time peaks</p>
              </div>
              <iconify-icon icon="lucide:award" className="text-2xl text-yellow-500"></iconify-icon>
            </div>
            {leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 text-2xl opacity-50">🏆</div>
                <p className="text-xs text-zinc-500">No leaderboard data yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <Link
                    key={entry.contestantId}
                    href={`/contestants/${entry.contestantId}`}
                    className={`group flex cursor-pointer items-center gap-4 ${index > 0 ? "border-t border-white/5 pt-4" : ""}`}
                  >
                    <span className="text-xl font-black italic text-zinc-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="text-lg font-display tracking-wide">{entry.contestantName}</p>
                      <p className="text-[10px] text-zinc-500">{entry.performanceCount} performances</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#cc0000]">{entry.averageRating.toFixed(1)}</p>
                      <p className="text-[9px] font-black uppercase text-zinc-600">{entry.totalVotes} votes</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/leaderboard"
              className="mt-8 block w-full rounded-xl bg-zinc-800 py-3 text-center text-xs font-bold uppercase tracking-widest transition-all hover:bg-zinc-700"
            >
              Full Leaderboard
            </Link>
          </aside>
        </section>
      </main>

      <footer className="mt-20 border-t border-white/5 bg-zinc-950 px-4 py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center">
          <div className="text-3xl font-display uppercase tracking-wider">
            Kill Tony <span className="text-[#cc0000]">Index</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
            <button className="hover:text-white" type="button">
              About the Project
            </button>
            <button className="hover:text-white" type="button">
              Submit a Moment
            </button>
            <button className="hover:text-white" type="button">
              API Access
            </button>
            <button className="hover:text-white" type="button">
              Terms
            </button>
          </div>
          <div className="max-w-xl space-y-2 text-xs font-medium text-zinc-600">
            <p>
              DISCLAIMER: We do not host or stream video content. All performance links jump to external YouTube
              timestamps. This is a community-driven index for navigational purposes only.
            </p>
            <p>&copy; 2024 Kill Tony Index Project. Kill Tony is a trademark of its respective owners.</p>
          </div>
          <div className="flex items-center gap-4 text-2xl text-zinc-500">
            <button className="transition-colors hover:text-[#cc0000]" type="button">
              <iconify-icon icon="lucide:twitter"></iconify-icon>
            </button>
            <button className="transition-colors hover:text-[#cc0000]" type="button">
              <iconify-icon icon="lucide:github"></iconify-icon>
            </button>
            <button className="transition-colors hover:text-[#cc0000]" type="button">
              <iconify-icon icon="lucide:youtube"></iconify-icon>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
