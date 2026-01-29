import type { YouTubeVideo } from "../sources/youtube";
import type { TranscriptSegment } from "../sources/transcripts";

import { fetchTranscript } from "../sources/transcripts";

export type EpisodeTranscriptMap = Map<string, TranscriptSegment[]>;

export const fetchEpisodeTranscripts = async (
  videos: YouTubeVideo[]
): Promise<EpisodeTranscriptMap> => {
  const entries: [string, TranscriptSegment[]][] = await Promise.all(
    videos.map(async (video): Promise<[string, TranscriptSegment[]]> => {
      try {
        const segments = await fetchTranscript(video.id);
        return [video.id, segments];
      } catch (error) {
        console.warn(`Transcript fetch failed for ${video.id}`, error);
        return [video.id, []];
      }
    })
  );

  return new Map(entries);
};
