import type { YouTubeVideo } from "../sources/youtube";

export type ExtractedEpisode = {
  youtubeId: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  youtubeUrl: string;
};

export const extractEpisodes = (videos: YouTubeVideo[]): ExtractedEpisode[] => {
  return videos.map((video) => ({
    youtubeId: video.id,
    title: video.title,
    publishedAt: video.publishedAt,
    durationSeconds: video.durationSeconds,
    youtubeUrl: video.url,
  }));
};
