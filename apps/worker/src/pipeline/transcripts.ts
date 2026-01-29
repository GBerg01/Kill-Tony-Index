import type { YouTubeVideo } from "../sources/youtube";
import type { TranscriptSegment } from "../sources/transcripts";

import { fetchTranscript } from "../sources/transcripts";

export type EpisodeTranscriptMap = Map<string, TranscriptSegment[]>;

export const fetchEpisodeTranscripts = async (
  videos: YouTubeVideo[]
): Promise<EpisodeTranscriptMap> => {
  const entries = await Promise.all(
    videos.map(async (video) => {
      try {
        const segments = await fetchTranscript(video.id);
        return [video.id, segments] as const;
      } catch (error) {
        console.warn(`Transcript fetch failed for ${video.id}`, error);
        return [video.id, []] as const;
      }
    })
  );

  return new Map(entries);
};
