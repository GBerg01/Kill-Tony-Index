import { LeaderboardTable } from "@/components/leaderboard-table";
import { leaderboardRows } from "@/lib/kt-index-data";

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Leaderboard</h1>
        <p className="text-sm text-kt-muted">
          Ranked by community ratings. Jump instantly to the best sets on YouTube.
        </p>
      </header>
      <div className="flex gap-2">
        {["Week", "Month", "All-time"].map((label) => (
          <button
            key={label}
            className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <LeaderboardTable rows={leaderboardRows} />
    </div>
  );
}
