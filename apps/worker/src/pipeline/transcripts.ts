import type { YouTubeVideo } from "../sources/youtube";
import type { TranscriptFetchResult, TranscriptSegment } from "../sources/transcripts";

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
  const missingTranscripts: Array<{ videoId: string; reason?: string }> = [];
  const errorTranscripts: Array<{ videoId: string; reason?: string }> = [];
  const enableFallback =
    process.env.TRANSCRIPT_FALLBACK_ENABLED === "true" || Boolean(process.env.TRANSCRIPT_FALLBACK_URL);

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
          const result = await fetchTranscript(video.id, {
            maxRetries: 3,
            retryDelayMs: 1000,
            verbose,
            enableFallback,
            videoDurationSeconds: video.durationSeconds,
          });
          return { videoId: video.id, result };
        } catch (error) {
          console.warn(`Transcript fetch failed for ${video.id}:`, error);
          return {
            videoId: video.id,
            result: {
              segments: [] as TranscriptSegment[],
              status: "error",
              reason: error instanceof Error ? error.message : String(error),
            } satisfies TranscriptFetchResult,
          };
        }
      })
    );

    for (const { videoId, result } of results) {
      transcriptMap.set(videoId, result.segments);
      if (result.status === "missing") {
        missingTranscripts.push({ videoId, reason: result.reason });
      } else if (result.status === "error") {
        errorTranscripts.push({ videoId, reason: result.reason });
      }
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
    if (missingTranscripts.length > 0) {
      const sample = missingTranscripts.slice(0, 5);
      console.info(
        `Missing transcripts: ${missingTranscripts.length} videos (showing ${sample.length})`
      );
      sample.forEach((entry) => {
        console.info(`  - ${entry.videoId}${entry.reason ? ` (${entry.reason})` : ""}`);
      });
    }
    if (errorTranscripts.length > 0) {
      const sample = errorTranscripts.slice(0, 5);
      console.warn(
        `Transcript errors: ${errorTranscripts.length} videos (showing ${sample.length})`
      );
      sample.forEach((entry) => {
        console.warn(`  - ${entry.videoId}${entry.reason ? ` (${entry.reason})` : ""}`);
      });
    }
  }

  return transcriptMap;
};
