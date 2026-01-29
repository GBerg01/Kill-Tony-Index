export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  url: string;
};

/**
 * Parse ISO 8601 duration format (e.g., "PT2H30M45S") to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetch video details (including duration) from Videos API
 */
async function fetchVideoDetails(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, { durationSeconds: number }>> {
  if (videoIds.length === 0) return new Map();

  const params = new URLSearchParams({
    key: apiKey,
    id: videoIds.join(","),
    part: "contentDetails",
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);

  if (!response.ok) {
    console.error("Failed to fetch video details");
    return new Map();
  }

  const payload = (await response.json()) as {
    items: Array<{
      id: string;
      contentDetails: { duration: string };
    }>;
  };

  const details = new Map<string, { durationSeconds: number }>();
  for (const item of payload.items) {
    details.set(item.id, {
      durationSeconds: parseDuration(item.contentDetails.duration),
    });
  }

  return details;
}

export const fetchRecentVideos = async (): Promise<YouTubeVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return [];
  }

  // Step 1: Search for recent videos
  const searchParams = new URLSearchParams({
    key: apiKey,
    channelId,
    part: "snippet",
    type: "video",
    order: "date",
    maxResults: "50",
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

  // Filter to only videos with valid IDs
  const videos = payload.items.filter((item) => item.id.videoId);
  const videoIds = videos.map((item) => item.id.videoId as string);

  // Step 2: Fetch video details (duration) in batch
  const videoDetails = await fetchVideoDetails(videoIds, apiKey);

  // Step 3: Combine data
  return videos
    .map((item) => {
      const videoId = item.id.videoId!;
      const details = videoDetails.get(videoId);

      return {
        id: videoId,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        durationSeconds: details?.durationSeconds || 0,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    })
    .filter((video): video is YouTubeVideo => video !== null);
};
