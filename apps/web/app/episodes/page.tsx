import Link from "next/link";

type Episode = {
  id: string;
  youtubeId: string;
  title: string;
  episodeNumber?: number | null;
  publishedAt: string;
  durationSeconds: number;
  youtubeUrl: string;
  performanceCount?: number;
};

type EpisodesResponse = {
  data: Episode[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

async function getEpisodes(page: number = 1, limit: number = 20): Promise<EpisodesResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/episodes?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }

  return res.json();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function extractEpisodeNumber(title: string): string | null {
  const match = title.match(/#(\d+)/);
  return match ? match[1] : null;
}

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const { data: episodes, pagination } = await getEpisodes(currentPage, 12);

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
              <span className="text-sm font-medium uppercase tracking-widest">
                {pagination.total} Episodes Indexed
              </span>
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

        {episodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <iconify-icon icon="lucide:video-off" className="mb-4 text-6xl text-zinc-600"></iconify-icon>
            <h2 className="mb-2 text-2xl font-display">No Episodes Found</h2>
            <p className="text-zinc-500">
              Run the worker to populate the database with Kill Tony episodes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {episodes.map((episode) => {
              const episodeNum = episode.episodeNumber || extractEpisodeNumber(episode.title);
              return (
                <article
                  key={episode.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 glow-red"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="mb-0.5 text-3xl font-display tracking-wide">
                        {episodeNum ? `Episode #${episodeNum}` : episode.title}
                      </h4>
                      <p className="text-xs font-medium uppercase tracking-tight text-zinc-500">
                        {formatDate(episode.publishedAt)}
                        {episode.durationSeconds > 0 && ` • ${formatDuration(episode.durationSeconds)}`}
                      </p>
                    </div>
                    {episode.performanceCount !== undefined && (
                      <span className="rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-[10px] font-black text-zinc-400">
                        {episode.performanceCount} MOMENTS
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-sm text-zinc-400">{episode.title}</p>

                  <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-4">
                    <Link
                      href={`/episodes/${episode.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-zinc-800 py-3 text-xs font-black uppercase tracking-wider transition-all group-hover:border-zinc-600 hover:bg-zinc-700"
                    >
                      View Performances
                      <iconify-icon
                        icon="lucide:arrow-right"
                        className="text-sm opacity-50 transition-opacity group-hover:opacity-100"
                      ></iconify-icon>
                    </Link>
                    <a
                      href={episode.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#cc0000]/10 py-3 text-xs font-black uppercase tracking-wider text-[#cc0000] transition-all hover:bg-[#cc0000]/20"
                    >
                      <iconify-icon icon="lucide:youtube" className="text-lg"></iconify-icon> Watch Full Episode
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/episodes?page=${currentPage - 1}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-500 transition-colors hover:text-white"
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
                    href={`/episodes?page=${pageNum}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-black ${
                      pageNum === currentPage
                        ? "bg-[#cc0000] text-white"
                        : "border border-white/5 bg-zinc-900 text-zinc-400 transition-colors hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {currentPage < pagination.totalPages && (
                <Link
                  href={`/episodes?page=${currentPage + 1}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-900 text-zinc-500 transition-colors hover:text-white"
                >
                  <iconify-icon icon="lucide:chevron-right"></iconify-icon>
                </Link>
              )}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Page {currentPage} of {pagination.totalPages} • {pagination.total} Episodes
            </p>
          </div>
        )}
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
