import { PerformanceCard } from "@/components/performance-card";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { getContestantById, getPerformancesByContestant } from "@/lib/kt-index-data";

export default async function ContestantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const contestant = getContestantById(params.id);
  const performances = getPerformancesByContestant(params.id);

  if (!contestant) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Contestant Not Found</h1>
        <p className="text-sm text-kt-muted">The contestant you're looking for doesn't exist.</p>
        <a href="/contestants" className="text-sm text-white/80 hover:text-white">
          ← Back to contestants
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <a href="/contestants" className="text-sm text-kt-muted hover:text-white">
        ← Back to contestants
      </a>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">{contestant.name}</h1>
          <p className="text-sm text-kt-muted">{contestant.appearances} indexed appearances</p>
        </div>
        <ConfidenceBadge level={contestant.avgRating >= 8.8 ? "High" : "Medium"} />
      </div>

      <div className="rounded-2xl border border-kt-border bg-kt-card p-5 shadow-soft-glow">
        <h2 className="text-lg font-semibold text-white">Contestant profile</h2>
        <div className="mt-3 grid gap-3 text-sm text-kt-muted md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Avg rating</p>
            <p className="text-base font-semibold text-white">{contestant.avgRating.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Appearances</p>
            <p className="text-base font-semibold text-white">{contestant.appearances}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Best set</p>
            <p className="text-base font-semibold text-white">Jump instantly</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Appearances</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {performances.map((performance) => (
            <PerformanceCard key={performance.id} performance={performance} />
          ))}
        </div>
      </div>
    </div>
  );
}
