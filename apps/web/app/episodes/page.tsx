import Link from "next/link";

const episodes = [
  {
    title: "Episode #642",
    date: "Feb 12, 2024 • Austin, TX",
    moments: "8 MOMENTS",
    guests: ["Joe Rogan", "Mark Normand"],
  },
  {
    title: "Episode #641",
    date: "Feb 05, 2024 • Austin, TX",
    moments: "12 MOMENTS",
    guests: ["Shane Gillis"],
  },
  {
    title: "Episode #640",
    date: "Jan 29, 2024 • Austin, TX",
    moments: "6 MOMENTS",
    guests: ["Adam Ray", "Tony Hinchcliffe"],
  },
  {
    title: "Episode #639",
    date: "Jan 22, 2024 • Austin, TX",
    moments: "10 MOMENTS",
    guests: ["Dr. Phil (Adam Ray)", "Sam Tallent"],
  },
  {
    title: "Episode #638",
    date: "Jan 15, 2024",
    moments: "14 MOMENTS",
    guests: ["Bert Kreischer", "Whitney Cummings"],
  },
  {
    title: "Episode #637",
    date: "Jan 08, 2024",
    moments: "9 MOMENTS",
    guests: ["Theo Von"],
  },
  {
    title: "Episode #636",
    date: "Jan 01, 2024",
    moments: "5 MOMENTS",
    guests: ["Big Jay Oakerson"],
  },
  {
    title: "Episode #635",
    date: "Dec 25, 2023",
    moments: "11 MOMENTS",
    guests: ["Holiday Special", "Multiple Guests"],
  },
];

export default function EpisodesPage() {
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
              <Link href="/episodes" className="text-white transition-colors">
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
          <div className="group relative hidden max-w-md flex-1 md:block">
            <iconify-icon
              icon="lucide:search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#cc0000]"
            ></iconify-icon>
            <input
              type="text"
              placeholder="Search episodes or guests..."
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
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 lg:px-8"
        style={{ viewTransitionName: "main-content" }}
      >
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-6xl font-display tracking-tight md:text-8xl">ALL EPISODES</h1>
            <p className="flex items-center gap-3 text-zinc-500">
              <span className="h-px w-8 bg-[#cc0000]"></span>
              <span className="text-sm font-medium uppercase tracking-widest">648 Episodes Indexed</span>
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-1.5">
            <button className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold uppercase text-white" type="button">
              Newest First
            </button>
            <button
              className="rounded-lg px-4 py-2 text-xs font-bold uppercase text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              type="button"
            >
              Popular
            </button>
            <div className="mx-1 h-6 w-px bg-white/10"></div>
            <button className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5" type="button">
              <iconify-icon icon="lucide:filter" className="text-lg"></iconify-icon>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {episodes.map((episode) => (
            <article
              key={episode.title}
              className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 glow-red"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="mb-0.5 text-3xl font-display tracking-wide">{episode.title}</h4>
                  <p className="text-xs font-medium uppercase tracking-tight text-zinc-500">{episode.date}</p>
                </div>
                <span className="rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-[10px] font-black text-zinc-400">
                  {episode.moments}
                </span>
              </div>

              <div className="flex min-h-[56px] flex-wrap gap-1.5 content-start">
                {episode.guests.map((guest) => (
                  <span
                    key={guest}
                    className="rounded bg-white/5 px-2 py-1 text-[11px] font-bold uppercase text-zinc-300"
                  >
                    {guest}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-4">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-zinc-800 py-3 text-xs font-black uppercase tracking-wider transition-all group-hover:border-zinc-600 hover:bg-zinc-700"
                  type="button"
                >
                  View Performances
                  <iconify-icon
                    icon="lucide:arrow-right"
                    className="text-sm opacity-50 transition-opacity group-hover:opacity-100"
                  ></iconify-icon>
                </button>
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#cc0000]/10 py-3 text-xs font-black uppercase tracking-wider text-[#cc0000] transition-all hover:bg-[#cc0000]/20"
                  type="button"
                >
                  <iconify-icon icon="lucide:youtube" className="text-lg"></iconify-icon> Watch Full Episode
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-500 transition-colors hover:text-white"
              type="button"
            >
              <iconify-icon icon="lucide:chevron-left"></iconify-icon>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#cc0000] text-sm font-black text-white">
              1
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-sm font-black text-zinc-400 transition-colors hover:text-white"
              type="button"
            >
              2
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-sm font-black text-zinc-400 transition-colors hover:text-white"
              type="button"
            >
              3
            </button>
            <span className="px-2 text-zinc-600">...</span>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-sm font-black text-zinc-400 transition-colors hover:text-white"
              type="button"
            >
              65
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-500 transition-colors hover:text-white"
              type="button"
            >
              <iconify-icon icon="lucide:chevron-right"></iconify-icon>
            </button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Showing 8 of 648 Episodes</p>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-zinc-950 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 md:flex-row lg:px-8">
          <div className="flex flex-col gap-2">
            <span className="font-display text-2xl uppercase tracking-tighter">
              Kill Tony <span className="text-[#cc0000]">Index</span>
            </span>
            <p className="text-xs text-zinc-500">A community preservation project. Not affiliated with Kill Tony.</p>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <button className="transition-colors hover:text-[#cc0000]" type="button">
              Terms
            </button>
            <button className="transition-colors hover:text-[#cc0000]" type="button">
              Privacy
            </button>
            <button className="transition-colors hover:text-[#cc0000]" type="button">
              API
            </button>
            <button className="flex items-center gap-1 transition-colors hover:text-white" type="button">
              <iconify-icon icon="mdi:github" className="text-lg"></iconify-icon> Source
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
