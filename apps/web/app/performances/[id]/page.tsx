import Link from "next/link";

const relatedPerformances = [
  { title: "The \"Never Made It\" Riff", score: "9.5", meta: "Ep. #640 • 1:04:12" },
  { title: "Crab Walk Intro", score: "9.1", meta: "Ep. #635 • 0:45:10" },
  { title: "The Vitamin C Speech", score: "8.9", meta: "Ep. #631 • 1:12:05" },
];

const discussion = [
  {
    author: "comedy_fan_99",
    time: "2 hours ago",
    body: "This set was absolutely legendary. The way Joe Rogan just stared at him in confusion made it even better.",
  },
  {
    author: "rocket_enthusiast",
    time: "5 hours ago",
    body: "The timestamp is perfect. Directly into the riff. Best index on the web.",
  },
];

export default function PerformanceDetailPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <nav
        className="sticky top-0 z-50 border-b border-white/5 bg-[#0f0f0f]/80 px-4 py-3 backdrop-blur-xl lg:px-8"
        style={{ viewTransitionName: "main-nav" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-display text-2xl font-bold uppercase tracking-tight">
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
              <Link href="/performances" className="text-white transition-colors">
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
          <div className="group relative hidden max-w-md flex-1 md:block">
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

      <main
        className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-8"
        style={{ viewTransitionName: "main-content" }}
      >
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="badge-confidence-high rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                <iconify-icon icon="lucide:shield-check"></iconify-icon> Confidence: High
              </span>
              <span className="text-sm font-medium text-zinc-500">Released Feb 12, 2024</span>
            </div>
            <h1 className="mb-2 text-6xl font-display leading-none md:text-8xl">Casey Rocket</h1>
            <p className="text-xl font-medium text-zinc-400">Episode #642 • Guest: Joe Rogan</p>
          </div>
          <div className="flex flex-col items-end text-right">
            <div className="flex items-baseline gap-2">
              <span className="rating-glow text-7xl font-display text-[#cc0000]">9.8</span>
              <span className="text-2xl font-display text-zinc-600">/ 10</span>
            </div>
            <p className="mt-1 text-sm font-bold uppercase tracking-widest text-zinc-500">1,402 VOTES</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section className="space-y-4">
              <div className="rounded-2xl bg-white/5 p-1">
                <button
                  className="btn-primary flex w-full items-center justify-center gap-4 rounded-xl py-6 font-display text-3xl"
                  type="button"
                >
                  <iconify-icon icon="lucide:timer" className="text-white/50"></iconify-icon>
                  ⏱ Jump to 1:23:14 (YouTube)
                </button>
              </div>
              <button
                className="btn-secondary flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-zinc-200"
                type="button"
              >
                <iconify-icon icon="lucide:play-circle"></iconify-icon>
                ▶ Watch full episode on YouTube
              </button>
              <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                Opens YouTube at the exact timestamp <span className="mx-1 text-[#cc0000]">•</span> Skip to set
              </p>
            </section>

            <section className="glass-card flex flex-col items-center gap-10 rounded-2xl p-8 md:flex-row">
              <div className="flex-1">
                <h3 className="mb-4 font-display text-2xl">Community Consensus</h3>
                <div className="mb-2 flex gap-1">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <iconify-icon
                      key={`star-${index}`}
                      icon="lucide:star"
                      className="text-2xl text-[#cc0000] fill-current"
                    ></iconify-icon>
                  ))}
                  <iconify-icon icon="lucide:star-half" className="text-2xl text-[#cc0000] fill-current"></iconify-icon>
                </div>
                <p className="text-sm text-zinc-400">Highly rated for physical comedy and absurdity.</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-bold uppercase text-zinc-500">Cast Vote</p>
                <div className="flex gap-2">
                  <button
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-zinc-800 transition-colors hover:border-green-500"
                    type="button"
                  >
                    <iconify-icon
                      icon="lucide:arrow-big-up"
                      className="text-2xl transition-colors group-hover:text-green-500"
                    ></iconify-icon>
                  </button>
                  <button
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-zinc-800 transition-colors hover:border-red-500"
                    type="button"
                  >
                    <iconify-icon
                      icon="lucide:arrow-big-down"
                      className="text-2xl transition-colors group-hover:text-red-500"
                    ></iconify-icon>
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="font-display text-2xl tracking-wide">Moment Context</h3>
              <div className="border-l-4 border-[#cc0000] bg-zinc-900/30 p-6 text-lg italic leading-relaxed text-zinc-300">
                "Never made it as a wise man... I couldn't cut it as a poor man stealing... I'm Casey Rocket and I'm
                here to riff. Joe Rogan is looking at me like I just stole his supplements. Real trap shit only!"
              </div>
            </section>

            <section className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold uppercase text-zinc-500">Share this moment:</span>
              <button className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold" type="button">
                <iconify-icon icon="mdi:twitter"></iconify-icon> Twitter
              </button>
              <button className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold" type="button">
                <iconify-icon icon="mdi:reddit"></iconify-icon> Reddit
              </button>
              <button className="btn-secondary flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold" type="button">
                <iconify-icon icon="lucide:link"></iconify-icon> Copy Link
              </button>
            </section>

            <section className="space-y-6 border-t border-white/5 pt-10">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-3xl">
                  Discussion <span className="text-zinc-600">(84)</span>
                </h3>
                <button className="text-sm font-bold text-[#cc0000] hover:underline" type="button">
                  Join the conversation
                </button>
              </div>
              <div className="space-y-4">
                {discussion.map((item) => (
                  <div key={item.author} className="rounded-xl border border-white/5 bg-white/5 p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-300">{item.author}</span>
                      <span className="text-[10px] uppercase text-zinc-600">{item.time}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="glass-card space-y-4 rounded-2xl p-6">
              <h4 className="font-display text-xl">Episode Context</h4>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded bg-zinc-800 font-display text-2xl text-[#cc0000]">
                  #642
                </div>
                <div>
                  <p className="text-sm font-bold">The Joe Rogan Episode</p>
                  <p className="text-xs text-zinc-500">Recorded at MotherShip</p>
                  <Link
                    href="/episodes"
                    className="mt-1 block text-[10px] font-black uppercase text-[#cc0000] hover:underline"
                  >
                    View all 8 moments ↗
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display text-xl">More from Casey Rocket</h4>
              <div className="flex flex-col gap-3">
                {relatedPerformances.map((item) => (
                  <div
                    key={item.title}
                    className="group cursor-pointer rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:border-[#cc0000]/30"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold transition-colors group-hover:text-[#cc0000]">{item.title}</p>
                      <span className="text-xs font-bold text-[#cc0000]">{item.score}</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-tighter text-zinc-500">{item.meta}</p>
                  </div>
                ))}
              </div>
              <button
                className="w-full rounded-lg bg-zinc-800/50 py-2 text-xs font-bold text-zinc-400 transition-colors hover:text-white"
                type="button"
              >
                View All 24 Performances
              </button>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h4 className="mb-4 font-display text-xl">Moment Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Total Votes</span>
                  <span className="font-bold">1,402</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Shares</span>
                  <span className="font-bold">328</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Views via Index</span>
                  <span className="font-bold">12,492</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Confidence Score</span>
                  <span className="font-bold uppercase text-green-500">High (99.1%)</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mx-auto mt-10 max-w-7xl border-t border-white/5 px-4 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-4">
            <span className="font-display text-xl font-bold uppercase tracking-tight">
              Kill Tony <span className="text-[#cc0000]">Index</span>
            </span>
            <span className="text-zinc-700">|</span>
            <p className="text-xs text-zinc-500">The ultimate Kill Tony moment curation tool.</p>
          </div>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <button className="hover:text-white" type="button">
              API
            </button>
            <button className="hover:text-white" type="button">
              Terms
            </button>
            <button className="hover:text-white" type="button">
              Privacy
            </button>
            <button className="hover:text-white" type="button">
              Github
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
