import Link from "next/link";

type LeaderboardRow = {
  id: string;
  ratingAvg: number;
  ratingCount: number;
  contestantName: string;
  contestantId: string;
  episodeNumber: number;
  episodeId: string;
  timestampLabel: string;
  youtubeJumpUrl: string;
};

type LeaderboardTableProps = {
  rows: LeaderboardRow[];
};

export const LeaderboardTable = ({ rows }: LeaderboardTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-kt-border bg-kt-card shadow-soft-glow">
    <div className="grid grid-cols-[40px_1.5fr_1fr_1fr_110px] gap-2 border-b border-kt-border px-4 py-3 text-xs uppercase tracking-widest text-kt-muted">
      <span>#</span>
      <span>Performance</span>
      <span>Rating</span>
      <span>Episode</span>
      <span className="text-right">Jump</span>
    </div>
    {rows.map((row, index) => (
      <div
        key={row.id}
        className="grid grid-cols-[40px_1.5fr_1fr_1fr_110px] gap-2 border-b border-kt-border px-4 py-3 text-sm text-white/80 last:border-b-0"
      >
        <span className="text-kt-muted">{index + 1}</span>
        <div>
          <Link href={`/performances/${row.id}`} className="font-semibold text-white hover:text-white/80">
            {row.contestantName}
          </Link>
          <div className="text-xs text-kt-muted">{row.ratingCount} votes</div>
        </div>
        <span>{row.ratingAvg.toFixed(1)}</span>
        <Link href={`/episodes/${row.episodeId}`} className="text-kt-muted hover:text-white">
          #{row.episodeNumber}
        </Link>
        <a
          href={row.youtubeJumpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-end gap-2 text-xs font-semibold text-white hover:text-white/80"
        >
          ⏱ {row.timestampLabel}
          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wide">
            YouTube ↗
          </span>
        </a>
      </div>
    ))}
  </div>
);
