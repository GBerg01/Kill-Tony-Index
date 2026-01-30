import type { YouTubeVideo } from "../sources/youtube";
import type { TranscriptSegment } from "../sources/transcripts";

import { fetchTranscript } from "../sources/transcripts";

export type EpisodeTranscriptMap = Map<string, TranscriptSegment[]>;

export type TranscriptFetchOptions = {
  /** Number of concurrent transcript fetches (default: 5) */
  concurrency?: number;
  /** Show verbose logging */
  verbose?: boolean;
};

/**
 * Fetch transcripts for multiple videos with controlled concurrency.
 * Too many parallel requests can trigger rate limiting.
 */
export const fetchEpisodeTranscripts = async (
  videos: YouTubeVideo[],
  options: TranscriptFetchOptions = {}
): Promise<EpisodeTranscriptMap> => {
  const { concurrency = 5, verbose = true } = options;
  const transcriptMap = new Map<string, TranscriptSegment[]>();

  if (videos.length === 0) {
    return transcriptMap;
  }

  if (verbose) {
    console.info(`Fetching transcripts for ${videos.length} videos (concurrency: ${concurrency})...`);
  }

  // Process in batches to control concurrency
  for (let i = 0; i < videos.length; i += concurrency) {
    const batch = videos.slice(i, i + concurrency);

    const results = await Promise.all(
      batch.map(async (video) => {
        try {
          const segments = await fetchTranscript(video.id, {
            maxRetries: 3,
            retryDelayMs: 1000,
            verbose,
          });
          return { videoId: video.id, segments };
        } catch (error) {
          console.warn(`Transcript fetch failed for ${video.id}:`, error);
          return { videoId: video.id, segments: [] as TranscriptSegment[] };
        }
      })
    );

    for (const { videoId, segments } of results) {
      transcriptMap.set(videoId, segments);
    }

    if (verbose && i + concurrency < videos.length) {
      const progress = Math.min(i + concurrency, videos.length);
      console.info(`Transcript progress: ${progress}/${videos.length} videos`);
    }

    // Small delay between batches to avoid rate limiting
    if (i + concurrency < videos.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Log summary
  const withTranscripts = Array.from(transcriptMap.values()).filter((s) => s.length > 0).length;
  if (verbose) {
    console.info(`Transcripts: ${withTranscripts}/${videos.length} videos have transcripts`);
  }

  return transcriptMap;
};
