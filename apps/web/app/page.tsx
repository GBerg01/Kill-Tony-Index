import Link from "next/link";

export default function HomePage() {
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
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
                type="button"
              >
                <iconify-icon icon="lucide:flame" className="text-orange-500"></iconify-icon> Top Performances
              </button>
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
                type="button"
              >
                <iconify-icon icon="lucide:dices" className="text-blue-400"></iconify-icon> Random Set
              </button>
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
                type="button"
              >
                <iconify-icon icon="lucide:calendar" className="text-emerald-400"></iconify-icon> Latest Episode
              </button>
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
                type="button"
              >
                <iconify-icon icon="lucide:trophy" className="text-yellow-500"></iconify-icon> Leaderboard
              </button>
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
          <div className="custom-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-6">
            {[
              {
                name: "Casey Rocket",
                episode: "Episode #642 (Guests: Joe Rogan)",
                rating: "9.8",
                votes: "1,402 votes",
                comments: "84",
                quote: "\"Never made it as a wise man... I couldn't cut it as a poor man stealing...\"",
                confidence: "high",
                note: "Opens YouTube at the exact moment • Skip to set",
              },
              {
                name: "Kam Patterson",
                episode: "Episode #641 (Guests: Shane Gillis)",
                rating: "9.2",
                votes: "856 votes",
                comments: "42",
                quote: "\"I love big rocks, you know what I'm saying? Look at this rock right here...\"",
                confidence: "medium",
                note: "Opens YouTube at the exact moment • No scrubbing",
              },
              {
                name: "Hans Kim",
                episode: "Episode #642 (Guests: Joe Rogan)",
                rating: "8.5",
                votes: "2,110 votes",
                comments: "129",
                quote: "\"This is a nice song. It's great to be here in Austin, Texas...\"",
                confidence: "high",
                note: "Instant skip to performance • Jump instantly",
              },
            ].map((card) => (
              <div
                key={card.name}
                className="glow-red flex min-w-[340px] flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-6"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      card.confidence === "high" ? "badge-confidence-high" : "badge-confidence-medium"
                    }`}
                  >
                    <iconify-icon icon={card.confidence === "high" ? "lucide:shield-check" : "lucide:info"}></iconify-icon>
                    Confidence: {card.confidence === "high" ? "High" : "Med"}
                  </div>
                  <span className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                    YOUTUBE <iconify-icon icon="lucide:external-link"></iconify-icon>
                  </span>
                </div>
                <div>
                  <h3 className="mb-1 text-2xl font-display tracking-wider">{card.name}</h3>
                  <p className="text-sm font-medium text-zinc-500">{card.episode}</p>
                </div>
                <div className="flex items-center gap-4 border-y border-white/5 py-2">
                  <div className="flex items-center gap-1 text-[#cc0000]">
                    <iconify-icon icon="lucide:star" className="fill-current"></iconify-icon>
                    <span className="font-bold">{card.rating}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{card.votes}</span>
                  <div className="ml-auto flex items-center gap-1 text-zinc-400">
                    <iconify-icon icon="lucide:message-square"></iconify-icon>
                    <span className="text-xs">{card.comments}</span>
                  </div>
                </div>
                <p className="snippet-clamp text-sm italic text-zinc-400">{card.quote}</p>
                <div className="mt-auto flex flex-col gap-2">
                  <button className="btn-primary w-full rounded-xl py-3 font-bold" type="button">
                    ⏱ Jump to moment (YouTube)
                  </button>
                  <button className="btn-secondary w-full rounded-xl py-3 text-sm font-bold text-zinc-300" type="button">
                    ▶ Watch full episode
                  </button>
                  <p className="mt-1 text-center text-[10px] uppercase tracking-tighter text-zinc-500">{card.note}</p>
                </div>
              </div>
            ))}
          </div>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  title: "Episode #642",
                  date: "Released Feb 12, 2024",
                  moments: "8 MOMENTS",
                  guests: ["Joe Rogan", "Mark Normand"],
                },
                {
                  title: "Episode #641",
                  date: "Released Feb 05, 2024",
                  moments: "12 MOMENTS",
                  guests: ["Shane Gillis", "Matt McCusker"],
                },
              ].map((episode) => (
                <div key={episode.title} className="flex flex-col gap-4 rounded-xl border border-white/5 bg-zinc-900 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-display tracking-wider">{episode.title}</h4>
                      <p className="text-xs text-zinc-500">{episode.date}</p>
                    </div>
                    <span className="rounded bg-zinc-800 px-2 py-1 text-[10px] font-bold text-zinc-400">
                      {episode.moments}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {episode.guests.map((guest) => (
                      <span key={guest} className="rounded bg-white/5 px-2 py-1 text-[10px] text-zinc-300">
                        {guest}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="flex-1 rounded-lg bg-zinc-800 py-2 text-xs font-bold transition-colors hover:bg-zinc-700"
                      type="button"
                    >
                      View Performances
                    </button>
                    <button
                      className="rounded-lg bg-[#cc0000]/10 px-3 py-2 text-xs font-bold text-[#cc0000] transition-colors hover:bg-[#cc0000]/20"
                      type="button"
                    >
                      <iconify-icon icon="lucide:youtube"></iconify-icon>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="mb-8 flex items-center gap-3">
                <div className="h-8 w-2 rounded-full bg-[#cc0000]"></div>
                <h2 className="text-3xl font-display tracking-wider">Top Contestants</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { initials: "CP", name: "Kam Patterson", meta: "24 sets • 8.9 Avg" },
                  { initials: "WM", name: "William Montgomery", meta: "312 sets • 9.4 Avg" },
                ].map((contestant) => (
                  <div
                    key={contestant.name}
                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-zinc-900 p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 font-bold text-zinc-500">
                      {contestant.initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-display tracking-wide">{contestant.name}</h4>
                      <p className="text-[10px] uppercase text-zinc-500">{contestant.meta}</p>
                    </div>
                    <iconify-icon icon="lucide:chevron-right" className="text-zinc-600"></iconify-icon>
                  </div>
                ))}
              </div>
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
            <div className="space-y-4">
              {[
                { rank: "01", name: "William Montgomery", meta: "Ep. #500 • 1:12:45", score: "9.9", votes: "3k+" },
                { rank: "02", name: "David Lucas", meta: "Ep. #412 • 0:45:12", score: "9.7", votes: "2.1k" },
                { rank: "03", name: "Ali Macofsky", meta: "Ep. #320 • 0:15:33", score: "9.6", votes: "1.8k" },
              ].map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`group flex cursor-pointer items-center gap-4 ${index > 0 ? "border-t border-white/5 pt-4" : ""}`}
                >
                  <span className="text-xl font-black italic text-zinc-700">{entry.rank}</span>
                  <div className="flex-1">
                    <p className="text-lg font-display tracking-wide">{entry.name}</p>
                    <p className="text-[10px] text-zinc-500">{entry.meta}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#cc0000]">{entry.score}</p>
                    <p className="text-[9px] font-black uppercase text-zinc-600">{entry.votes}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-8 w-full rounded-xl bg-zinc-800 py-3 text-xs font-bold uppercase tracking-widest transition-all hover:bg-zinc-700"
              type="button"
            >
              Full Leaderboard
            </button>
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
