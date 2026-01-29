import Link from "next/link";

const leaderboardRows = [
  {
    rank: "01",
    initials: "WM",
    name: "William Montgomery",
    role: "Regular",
    episode: "#500 Anniversary Special",
    timestamp: "01:12:45",
    rating: "9.9",
    votes: "12,402",
  },
  {
    rank: "02",
    initials: "CR",
    name: "Casey Rocket",
    role: "Performance",
    episode: "#642 (Guests: Joe Rogan)",
    timestamp: "00:45:12",
    rating: "9.8",
    votes: "8,119",
  },
  {
    rank: "03",
    initials: "KL",
    name: "Kam Patterson",
    role: "Regular",
    episode: "#618 Mother's Day",
    timestamp: "00:22:30",
    rating: "9.7",
    votes: "7,420",
  },
  {
    rank: "04",
    initials: "DL",
    name: "David Lucas",
    role: "Legend",
    episode: "#530 Live from Austin",
    timestamp: "01:55:04",
    rating: "9.6",
    votes: "6,280",
  },
  {
    rank: "05",
    initials: "AA",
    name: "Ahren Belisle",
    role: "Golden Ticket",
    episode: "#588 Debut Set",
    timestamp: "00:33:15",
    rating: "9.5",
    votes: "5,912",
  },
];

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <nav
        className="sticky top-0 z-50 border-b border-white/5 bg-[#0f0f0f]/80 px-4 py-3 backdrop-blur-xl lg:px-8"
        style={{ viewTransitionName: "main-nav" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl font-display uppercase tracking-tight">
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
              <Link href="/leaderboard" className="border-b-2 border-[#cc0000] pb-1 text-white">
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
              placeholder="Search ranks, performers..."
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
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-6xl font-display uppercase leading-none md:text-8xl">
              LEADERBOARD <span className="inline-block animate-bounce">🎫</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              The gold standard of Kill Tony history. Ranked by the community based on set quality, roast ability, and
              interview chaos.
            </p>
          </div>
          <div className="flex rounded-xl border border-white/5 bg-zinc-900/50 p-1">
            {[
              { label: "THIS WEEK" },
              { label: "THIS MONTH" },
              { label: "ALL-TIME", active: true },
            ].map((item) => (
              <button
                key={item.label}
                className={`px-6 py-2 text-sm font-bold transition-all ${
                  item.active ? "rounded-lg bg-white/5 text-white" : "text-zinc-500 hover:text-white"
                }`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-900 p-4 md:flex-row">
          <div className="relative flex-1">
            <iconify-icon icon="lucide:search" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"></iconify-icon>
            <input
              type="text"
              placeholder="Filter by name or episode..."
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#cc0000] focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-400 outline-none focus:border-[#cc0000]">
              <option>All Episode Formats</option>
              <option>Arena Shows</option>
              <option>Mothership Shows</option>
              <option>Vulcan Shows</option>
            </select>
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-zinc-400 transition-all hover:bg-white/10"
              type="button"
            >
              <iconify-icon icon="lucide:sliders-horizontal" className="text-xl"></iconify-icon>
            </button>
          </div>
        </div>

        <div className="mb-12 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900">
          <div className="custom-scrollbar overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  {["Rank", "Contestant", "Episode", "Timestamp", "Rating", "Votes", "Jump"].map((title) => (
                    <th
                      key={title}
                      className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 ${
                        title === "Rank" ? "w-16 text-left" : title === "Jump" ? "text-right" : "text-left"
                      }`}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboardRows.map((row) => (
                  <tr key={row.rank} className="row-hover group cursor-pointer transition-all duration-300">
                    <td className="px-6 py-6">
                      <span className="text-2xl font-display font-black italic leading-none text-[#cc0000]">
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 font-display text-xl uppercase text-zinc-500">
                          {row.initials}
                        </div>
                        <div>
                          <button className="font-bold transition-colors hover:text-[#cc0000]" type="button">
                            {row.name}
                          </button>
                          <p className="text-[10px] font-black uppercase text-zinc-500">{row.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <button className="text-sm text-zinc-400 transition-colors hover:text-white" type="button">
                        {row.episode}
                      </button>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-mono text-sm text-zinc-500">{row.timestamp}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-display font-bold text-[#cc0000]">{row.rating}</span>
                        <iconify-icon icon="lucide:star" className="text-[#cc0000] text-sm fill-current"></iconify-icon>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-medium tracking-tight text-zinc-500">{row.votes}</span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button className="btn-primary whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold" type="button">
                        ⏱ Jump
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-500 transition-all hover:text-white"
            type="button"
          >
            <iconify-icon icon="lucide:chevron-left" className="text-xl"></iconify-icon>
          </button>
          <div className="flex gap-2">
            {["1", "2", "3", "12"].map((label, index) => (
              <button
                key={label}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-sm font-bold transition-all ${
                  index === 0
                    ? "bg-[#cc0000] text-white"
                    : index === 3
                      ? "bg-zinc-900 text-zinc-400 hover:text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
                type="button"
              >
                {label}
              </button>
            ))}
            <span className="flex h-12 w-12 items-center justify-center text-zinc-600">...</span>
          </div>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-500 transition-all hover:text-white"
            type="button"
          >
            <iconify-icon icon="lucide:chevron-right" className="text-xl"></iconify-icon>
          </button>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black/50 px-8 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-sm text-zinc-500">
            &copy; 2024 Kill Tony Index. Created by the fans. Not affiliated with Kill Tony or Deathsquad.
          </div>
          <div className="flex items-center gap-6">
            <button
              className="text-xs font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
              type="button"
            >
              About the Index
            </button>
            <button
              className="text-xs font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-white"
              type="button"
            >
              Privacy
            </button>
            <button className="text-zinc-400 transition-colors hover:text-[#cc0000]" type="button">
              <iconify-icon icon="mdi:twitter" className="text-2xl"></iconify-icon>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
