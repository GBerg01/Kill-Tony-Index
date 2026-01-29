import { EpisodeDetailClient } from "@/app/episodes/[id]/episode-detail-client";
import { getEpisodeById, getPerformancesByEpisode } from "@/lib/kt-index-data";

export default async function EpisodeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const episode = getEpisodeById(params.id);
  const performances = getPerformancesByEpisode(params.id);

  if (!episode) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Episode Not Found</h1>
        <p className="text-sm text-kt-muted">The episode you're looking for doesn't exist.</p>
        <a href="/episodes" className="text-sm text-white/80 hover:text-white">
          ← Back to episodes
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <a href="/episodes" className="text-sm text-kt-muted hover:text-white">
          ← Back to episodes
        </a>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">{episode.title}</h1>
          <p className="text-sm text-kt-muted">
            {episode.date} · {episode.performanceCount} performances indexed · Avg rating{" "}
            {episode.avgRating.toFixed(1)}
          </p>
        </div>
      </div>
      <EpisodeDetailClient episode={episode} performances={performances} />
    </div>
  );
}
