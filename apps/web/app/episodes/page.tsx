import { EpisodeCard } from "@/components/episode-card";
import { episodes } from "@/lib/kt-index-data";

export default async function EpisodesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Episodes index</h1>
        <p className="text-sm text-kt-muted">
          Think IMDb for Kill Tony. Every episode has structured performance timestamps.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>
    </div>
  );
}
