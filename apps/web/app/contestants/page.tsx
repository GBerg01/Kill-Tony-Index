import Link from "next/link";

type Contestant = {
  id: string;
  displayName: string;
  aliases?: string[];
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
  performanceCount?: number;
  averageRating?: number;
};

type ContestantsResponse = {
  data: Contestant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

async function getContestants(page: number = 1, limit: number = 24): Promise<ContestantsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/contestants?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      data: [],
      pagination: { page: 1, limit: 24, total: 0, totalPages: 0 },
    };
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

export default async function ContestantsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const { data: contestants, pagination } = await getContestants(currentPage, 24);

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
              <span className="text-white">{pagination.total} legends indexed.</span>
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

        {contestants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <iconify-icon icon="lucide:users" className="mb-4 text-6xl text-zinc-600"></iconify-icon>
            <h2 className="mb-2 text-2xl font-display">No Contestants Found</h2>
            <p className="text-zinc-500">
              Run the worker to populate the database with Kill Tony performances.
            </p>
          </div>
        ) : (
          <div className="contestant-grid mb-16">
            {contestants.map((contestant) => (
              <div
                key={contestant.id}
                className="glow-red group relative flex flex-col gap-6 rounded-2xl border border-white/5 bg-zinc-900/40 p-8 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-800 text-xl font-display transition-colors group-hover:border-[#cc0000]">
                    {getInitials(contestant.displayName)}
                  </div>
                  <div>
                    <h3 className="mb-1 text-3xl font-display leading-none">{contestant.displayName}</h3>
                    {contestant.aliases && contestant.aliases.length > 0 && (
                      <p className="text-xs uppercase tracking-tighter text-zinc-500">
                        aka {contestant.aliases[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Appearances</span>
                    <span className="text-2xl font-display text-[#cc0000]">
                      {contestant.performanceCount ?? "—"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Avg Rating</span>
                    <span className="flex items-center gap-1.5 text-2xl font-display text-[#cc0000]">
                      {contestant.averageRating?.toFixed(1) ?? "—"}
                      {contestant.averageRating && (
                        <iconify-icon icon="lucide:star" className="text-sm"></iconify-icon>
                      )}
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  <Link
                    href={`/contestants/${contestant.id}`}
                    className="btn-primary flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold uppercase"
                  >
                    View Profile
                  </Link>
                  <div className="flex gap-2">
                    {contestant.instagramUrl && (
                      <a
                        href={contestant.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-zinc-800 py-2 text-xs font-bold text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                      >
                        <iconify-icon icon="mdi:instagram"></iconify-icon>
                      </a>
                    )}
                    {contestant.youtubeUrl && (
                      <a
                        href={contestant.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-zinc-800 py-2 text-xs font-bold text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                      >
                        <iconify-icon icon="lucide:youtube"></iconify-icon>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            {currentPage > 1 && (
              <Link
                href={`/contestants?page=${currentPage - 1}`}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 transition-colors hover:text-white"
              >
                <iconify-icon icon="lucide:chevron-left"></iconify-icon>
              </Link>
            )}

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Link
                  key={pageNum}
                  href={`/contestants?page=${pageNum}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${
                    pageNum === currentPage
                      ? "bg-[#cc0000] text-white"
                      : "bg-zinc-800 text-zinc-400 transition-colors hover:text-white"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {currentPage < pagination.totalPages && (
              <Link
                href={`/contestants?page=${currentPage + 1}`}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 transition-colors hover:text-white"
              >
                <iconify-icon icon="lucide:chevron-right"></iconify-icon>
              </Link>
            )}
          </div>
        )}
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
