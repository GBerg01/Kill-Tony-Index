import Link from "next/link";

type LeaderboardEntry = {
  contestantId: string;
  contestantName: string;
  averageRating: number;
  performanceCount: number;
  totalVotes: number;
};

type LeaderboardResponse = {
  data: LeaderboardEntry[];
};

async function getLeaderboard(limit: number = 25): Promise<LeaderboardResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/leaderboards?limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { data: [] };
  }

  return res.json();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function LeaderboardPage() {
  const { data: leaderboard } = await getLeaderboard(50);

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
              LEADERBOARD
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
              The gold standard of Kill Tony history. Ranked by the community based on average rating across all performances.
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

        {leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <iconify-icon icon="lucide:trophy" className="mb-4 text-6xl text-zinc-600"></iconify-icon>
            <h2 className="mb-2 text-2xl font-display">No Rankings Yet</h2>
            <p className="text-zinc-500">
              Run the worker to populate data, then rate performances to build the leaderboard.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-900 p-4 md:flex-row">
              <div className="relative flex-1">
                <iconify-icon icon="lucide:search" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"></iconify-icon>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-sm transition-all focus:border-[#cc0000] focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-400 outline-none focus:border-[#cc0000]">
                  <option>Min 1 Performance</option>
                  <option>Min 3 Performances</option>
                  <option>Min 5 Performances</option>
                  <option>Min 10 Performances</option>
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
                      {["Rank", "Contestant", "Avg Rating", "Performances", "Total Votes", "Profile"].map((title) => (
                        <th
                          key={title}
                          className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 ${
                            title === "Rank" ? "w-16 text-left" : title === "Profile" ? "text-right" : "text-left"
                          }`}
                        >
                          {title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.contestantId} className="row-hover group cursor-pointer transition-all duration-300">
                        <td className="px-6 py-6">
                          <span className={`text-2xl font-display font-black italic leading-none ${
                            index < 3 ? "text-[#cc0000]" : "text-zinc-500"
                          }`}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 font-display text-xl uppercase text-zinc-500">
                              {getInitials(entry.contestantName)}
                            </div>
                            <div>
                              <Link
                                href={`/contestants/${entry.contestantId}`}
                                className="font-bold transition-colors hover:text-[#cc0000]"
                              >
                                {entry.contestantName}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-display font-bold text-[#cc0000]">
                              {entry.averageRating > 0 ? entry.averageRating.toFixed(1) : "—"}
                            </span>
                            {entry.averageRating > 0 && (
                              <iconify-icon icon="lucide:star" className="text-[#cc0000] text-sm fill-current"></iconify-icon>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-medium text-zinc-400">{entry.performanceCount}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-medium tracking-tight text-zinc-500">
                            {entry.totalVotes.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <Link
                            href={`/contestants/${entry.contestantId}`}
                            className="btn-primary whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
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
