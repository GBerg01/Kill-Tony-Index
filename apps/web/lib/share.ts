import type { Performance } from "@/lib/kt-index-data";

export const buildShareText = (performance: Performance): string =>
  `${performance.contestantName} killed at ${performance.timestampLabel} on Kill Tony #${performance.episodeNumber}. Rated ${performance.ratingAvg.toFixed(1)} on Kill Tony Index.`;
