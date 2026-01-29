import { ContestantCard } from "@/components/contestant-card";
import { contestants, performances } from "@/lib/kt-index-data";

export default async function ContestantsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Contestants index</h1>
        <p className="text-sm text-kt-muted">IMDb-style profiles for every standout set.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {contestants.map((contestant) => (
          <ContestantCard
            key={contestant.id}
            contestant={contestant}
            bestPerformance={performances.find((performance) => performance.id === contestant.bestPerformanceId)}
          />
        ))}
      </div>
    </div>
  );
}
