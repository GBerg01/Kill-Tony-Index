export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  url: string;
};

const parseYouTubeDuration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return 0;
  }

  const [, hours, minutes, seconds] = match;
  const totalHours = hours ? parseInt(hours, 10) : 0;
  const totalMinutes = minutes ? parseInt(minutes, 10) : 0;
  const totalSeconds = seconds ? parseInt(seconds, 10) : 0;

  return totalHours * 3600 + totalMinutes * 60 + totalSeconds;
};

export const fetchRecentVideos = async (): Promise<YouTubeVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.error("Missing env vars - YOUTUBE_API_KEY:", !!apiKey, "YOUTUBE_CHANNEL_ID:", !!channelId);
    return [];
  }

  const searchParams = new URLSearchParams({
    key: apiKey,
    channelId,
    part: "snippet",
    order: "date",
    maxResults: "25",
    type: "video",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("YouTube API error:", response.status, errorBody);
    throw new Error(`Failed to fetch YouTube videos: ${response.status}`);
  }

  const payload = (await response.json()) as {
    items: Array<{
      id: { videoId?: string };
      snippet: { title: string; publishedAt: string };
    }>;
  };

  const videos = payload.items
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

  if (videos.length === 0) {
    return [];
  }

  const durationParams = new URLSearchParams({
    key: apiKey,
    part: "contentDetails",
    id: videos.map((video) => video.id).join(","),
  });

  const durationResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${durationParams}`
  );

  if (!durationResponse.ok) {
    throw new Error("Failed to fetch YouTube video durations");
  }

  const durationPayload = (await durationResponse.json()) as {
    items: Array<{ id: string; contentDetails: { duration: string } }>;
  };

  const durationMap = new Map(
    durationPayload.items.map((item) => [item.id, parseYouTubeDuration(item.contentDetails.duration)])
  );

  return videos.map((video) => ({
    ...video,
    durationSeconds: durationMap.get(video.id) ?? 0,
  }));
};
