import Link from "next/link";

const contestants = [
  {
    initials: "WM",
    name: "William Montgomery",
    title: "The Big Red Machine",
    appearances: "156",
    rating: "9.7",
    badge: "Regular",
  },
  {
    initials: "HK",
    name: "Hans Kim",
    title: "Regular / Hall of Fame",
    appearances: "112",
    rating: "9.2",
  },
  {
    initials: "CR",
    name: "Casey Rocket",
    title: "The Crab Man",
    appearances: "14",
    rating: "9.8",
    badge: "Trending",
  },
  {
    initials: "RD",
    name: "Ric Diez",
    title: "Brussels' Finest",
    appearances: "4",
    rating: "9.5",
  },
  {
    initials: "KP",
    name: "Kam Patterson",
    title: "Orlando's Own",
    appearances: "32",
    rating: "8.9",
    badge: "Regular",
  },
  {
    initials: "AM",
    name: "Ari Matti",
    title: "The Estonian Giant",
    appearances: "8",
    rating: "9.6",
  },
];

export default function ContestantsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <nav
        className="sticky top-0 z-50 border-b border-white/5 bg-[#0f0f0f]/90 px-4 py-3 backdrop-blur-xl lg:px-8"
        style={{ viewTransitionName: "main-nav" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl font-display uppercase">
                Kill Tony <span className="text-[#cc0000]">Index</span>
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-sm font-medium text-zinc-400 lg:flex">
              <Link href="/episodes" className="transition-colors hover:text-white">
                Episodes
              </Link>
              <Link href="/contestants" className="text-white transition-colors">
                Contestants
              </Link>
              <Link href="/performances" className="transition-colors hover:text-white">
                Performances
              </Link>
              <Link href="/leaderboard" className="transition-colors hover:text-white">
                Leaderboard
              </Link>
              <Link href="/guests" className="font-display transition-colors hover:text-white">
                GUESTS
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
              placeholder="Search contestants by name..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm transition-all focus:border-[#cc0000] focus:outline-none focus:ring-1 focus:ring-[#cc0000]"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-zinc-300" type="button">
              Sign in
            </button>
            <button
              className="btn-primary rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider"
              type="button"
            >
              Submit Moment
            </button>
          </div>
        </div>
      </nav>

      <main
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 lg:px-8"
        style={{ viewTransitionName: "main-content" }}
      >
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-6xl font-display uppercase leading-tight md:text-8xl">
              All <span className="text-[#cc0000]">Contestants</span>
            </h1>
            <p className="mt-2 max-w-xl text-lg text-zinc-500">
              The definitive database of every bucket pull, golden ticket, and regular in Kill Tony history.{" "}
              <span className="text-white">428 legends indexed.</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-[#cc0000] px-4 py-2 text-sm font-bold text-white" type="button">
              <iconify-icon icon="lucide:trending-up"></iconify-icon>
              Trending
            </button>
            <button
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
              type="button"
            >
              Appearances
            </button>
            <button
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
              type="button"
            >
              Avg Rating
            </button>
            <button
              className="rounded-lg bg-zinc-800 px-3 py-2 text-lg font-bold text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
              type="button"
            >
              NEWEST
            </button>
          </div>
        </div>

        <div className="contestant-grid mb-16">
          {contestants.map((contestant) => (
            <div
              key={contestant.name}
              className="glow-red group relative flex flex-col gap-6 rounded-2xl border border-white/5 bg-zinc-900/40 p-8 transition-all duration-300"
            >
              {contestant.badge ? (
                <div className="absolute right-4 top-4">
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      contestant.badge === "Regular"
                        ? "border-red-500/20 bg-red-950/40 text-red-500"
                        : "border-white/10 bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {contestant.badge}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-800 text-xl font-display transition-colors group-hover:border-[#cc0000]">
                  {contestant.initials}
                </div>
                <div>
                  <h3 className="mb-1 text-3xl font-display leading-none">{contestant.name}</h3>
                  <p className="text-xs uppercase tracking-tighter text-zinc-500">{contestant.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Appearances</span>
                  <span className="text-2xl font-display text-[#cc0000]">{contestant.appearances}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Avg Rating</span>
                  <span className="flex items-center gap-1.5 text-2xl font-display text-[#cc0000]">
                    {contestant.rating}
                    <iconify-icon icon="lucide:star" className="text-sm"></iconify-icon>
                  </span>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button className="btn-primary w-full rounded-xl py-3 text-sm font-bold uppercase" type="button">
                  Best Set
                </button>
                <button className="btn-secondary w-full rounded-xl py-3 text-sm font-bold uppercase" type="button">
                  All Appearances
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 transition-colors hover:text-white"
            type="button"
          >
            <iconify-icon icon="lucide:chevron-left"></iconify-icon>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#cc0000] font-bold text-white" type="button">
            1
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:text-white"
            type="button"
          >
            2
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:text-white"
            type="button"
          >
            3
          </button>
          <span className="px-2 text-zinc-600">...</span>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-colors hover:text-white"
            type="button"
          >
            18
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 transition-colors hover:text-white"
            type="button"
          >
            <iconify-icon icon="lucide:chevron-right"></iconify-icon>
          </button>
        </div>
      </main>

      <footer className="mt-20 border-t border-white/5 bg-[#0a0a0a] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 md:flex-row">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-display uppercase tracking-wider">
              Kill Tony <span className="text-[#cc0000]">Index</span>
            </span>
            <p className="text-xs text-zinc-500">Not affiliated with Kill Tony or Deathsquad. Just fans of the bucket.</p>
          </div>
          <div className="flex items-center gap-8 text-sm text-zinc-400">
            <button className="transition-colors hover:text-white" type="button">
              Terms
            </button>
            <button className="transition-colors hover:text-white" type="button">
              Privacy
            </button>
            <button className="transition-colors hover:text-white" type="button">
              Contribute
            </button>
            <button className="text-xl text-zinc-600 transition-colors hover:text-[#cc0000]" type="button">
              <iconify-icon icon="lucide:youtube"></iconify-icon>
            </button>
            <button className="text-xl text-zinc-600 transition-colors hover:text-[#cc0000]" type="button">
              <iconify-icon icon="lucide:twitter"></iconify-icon>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
