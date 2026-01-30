import type { YouTubeVideo } from "../sources/youtube";

export type ExtractedEpisode = {
  youtubeId: string;
  title: string;
  episodeNumber: number | null;
  publishedAt: string;
  durationSeconds: number;
  youtubeUrl: string;
};

/**
 * Extract episode number from Kill Tony video titles.
 * Common formats:
 * - "KILL TONY #700"
 * - "Kill Tony Episode 700"
 * - "KILL TONY - Episode #700"
 * - "Kill Tony #700 - Joe Rogan"
 */
const extractEpisodeNumber = (title: string): number | null => {
  // Pattern 1: "#XXX" format (most common)
  const hashMatch = title.match(/#(\d+)/);
  if (hashMatch) {
    return parseInt(hashMatch[1], 10);
  }

  // Pattern 2: "Episode XXX" format
  const episodeMatch = title.match(/episode\s*(\d+)/i);
  if (episodeMatch) {
    return parseInt(episodeMatch[1], 10);
  }

  // Pattern 3: "EP XXX" or "Ep. XXX"
  const epMatch = title.match(/ep\.?\s*(\d+)/i);
  if (epMatch) {
    return parseInt(epMatch[1], 10);
  }

  return null;
};

/**
 * Check if a video is likely a Kill Tony episode (vs clip, compilation, etc.)
 */
export const isKillTonyEpisode = (title: string): boolean => {
  const lower = title.toLowerCase();

  // Must contain "kill tony" somewhere
  if (!lower.includes("kill tony")) {
    return false;
  }

  // Skip clips, compilations, and trailers
  const skipKeywords = ["clip", "compilation", "best of", "trailer", "preview", "highlights"];
  if (skipKeywords.some((keyword) => lower.includes(keyword))) {
    return false;
  }

  // Should have an episode number
  if (extractEpisodeNumber(title) !== null) {
    return true;
  }

  // Fallback: check for date-based episode indicators
  return /\d{4}/.test(title) || lower.includes("live");
};

export const extractEpisodes = (videos: YouTubeVideo[]): ExtractedEpisode[] => {
  return videos
    .filter((video) => isKillTonyEpisode(video.title))
    .map((video) => ({
      youtubeId: video.id,
      title: video.title,
      episodeNumber: extractEpisodeNumber(video.title),
      publishedAt: video.publishedAt,
      durationSeconds: video.durationSeconds,
      youtubeUrl: video.url,
    }));
};
