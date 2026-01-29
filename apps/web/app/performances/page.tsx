import { PerformanceCard } from "@/components/performance-card";
import { performances } from "@/lib/kt-index-data";

export default function PerformancesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Performances index</h1>
        <p className="text-sm text-kt-muted">
          Find the exact Kill Tony moment you want in 2 clicks. Jump instantly — no scrubbing.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        {["All moments", "Highest rated", "Most discussed", "Low confidence"].map((label) => (
          <button
            key={label}
            className="rounded-full border border-kt-border bg-kt-card px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {performances.map((performance) => (
          <PerformanceCard key={performance.id} performance={performance} />
        ))}
      </div>
    </div>
  );
}
