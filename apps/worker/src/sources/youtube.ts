export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  url: string;
};

export const fetchRecentVideos = async (): Promise<YouTubeVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return [];
  }

  const searchParams = new URLSearchParams({
    key: apiKey,
    channelId,
    part: "snippet",
    order: "date",
    maxResults: "10",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube videos");
  }

  const payload = (await response.json()) as {
    items: Array<{
      id: { videoId?: string };
      snippet: { title: string; publishedAt: string };
    }>;
  };

  return payload.items
    .map((item) => {
      if (!item.id.videoId) {
        return null;
      }

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        durationSeconds: 0,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      };
    })
    .filter((video): video is YouTubeVideo => video !== null);
};
