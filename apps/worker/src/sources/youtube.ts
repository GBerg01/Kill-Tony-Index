export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  url: string;
  description?: string;
};

export type FetchOptions = {
  /** Maximum number of videos to fetch (default: 50, max: unlimited with pagination) */
  maxVideos?: number;
  /** Fetch all videos from the channel (overrides maxVideos) */
  fetchAll?: boolean;
  /** Show progress logging */
  verbose?: boolean;
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

const fetchVideoDurations = async (
  videoIds: string[],
  apiKey: string
): Promise<Map<string, number>> => {
  if (videoIds.length === 0) {
    return new Map();
  }

  // YouTube API allows max 50 IDs per request
  const chunks: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const durationMap = new Map<string, number>();

  for (const chunk of chunks) {
    const durationParams = new URLSearchParams({
      key: apiKey,
      part: "contentDetails",
      id: chunk.join(","),
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${durationParams}`
    );

    if (!response.ok) {
      console.warn(`Failed to fetch durations for batch of ${chunk.length} videos`);
      continue;
    }

    const payload = (await response.json()) as {
      items: Array<{ id: string; contentDetails: { duration: string } }>;
    };

    for (const item of payload.items) {
      durationMap.set(item.id, parseYouTubeDuration(item.contentDetails.duration));
    }
  }

  return durationMap;
};

const fetchVideoDescriptions = async (
  videoIds: string[],
  apiKey: string
): Promise<Map<string, string>> => {
  if (videoIds.length === 0) {
    return new Map();
  }

  const chunks: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const descriptionMap = new Map<string, string>();

  for (const chunk of chunks) {
    const params = new URLSearchParams({
      key: apiKey,
      part: "snippet",
      id: chunk.join(","),
    });

    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);

    if (!response.ok) {
      console.warn(`Failed to fetch descriptions for batch of ${chunk.length} videos`);
      continue;
    }

    const payload = (await response.json()) as {
      items: Array<{ id: string; snippet?: { description?: string } }>;
    };

    for (const item of payload.items) {
      if (!item.id) {
        continue;
      }
      descriptionMap.set(item.id, item.snippet?.description ?? "");
    }
  }

  return descriptionMap;
};

/**
 * Fetch recent videos from the Kill Tony channel.
 * Uses pagination to fetch more than the default 50 results.
 */
export const fetchRecentVideos = async (options: FetchOptions = {}): Promise<YouTubeVideo[]> => {
  const { maxVideos = 50, fetchAll = false, verbose = true } = options;
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.warn("Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID");
    return [];
  }

  const allVideos: YouTubeVideo[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;

  while (true) {
    const searchParams = new URLSearchParams({
      key: apiKey,
      channelId,
      part: "snippet",
      order: "date",
      maxResults: "50", // Max per page
      type: "video",
    });

    if (pageToken) {
      searchParams.set("pageToken", pageToken);
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams}`);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch YouTube videos: ${response.status} - ${error}`);
    }

    const payload = (await response.json()) as {
      items: Array<{
        id: { videoId?: string };
        snippet: { title: string; publishedAt: string };
      }>;
      nextPageToken?: string;
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

    allVideos.push(...videos);
    pageCount++;

    if (verbose) {
      console.info(`Fetched page ${pageCount}: ${videos.length} videos (total: ${allVideos.length})`);
    }

    // Check if we should continue paginating
    if (!payload.nextPageToken) {
      break; // No more pages
    }

    if (!fetchAll && allVideos.length >= maxVideos) {
      break; // Reached the limit
    }

    pageToken = payload.nextPageToken;

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Trim to maxVideos if not fetching all
  const videosToProcess = fetchAll ? allVideos : allVideos.slice(0, maxVideos);

  if (videosToProcess.length === 0) {
    return [];
  }

  // Fetch durations in batches
  if (verbose) {
    console.info(`Fetching durations for ${videosToProcess.length} videos...`);
  }

  const durationMap = await fetchVideoDurations(
    videosToProcess.map((v) => v.id),
    apiKey
  );

  const descriptionMap = await fetchVideoDescriptions(
    videosToProcess.map((v) => v.id),
    apiKey
  );

  return videosToProcess.map((video) => ({
    ...video,
    durationSeconds: durationMap.get(video.id) ?? 0,
    description: descriptionMap.get(video.id) ?? "",
  }));
};

/**
 * Convenience function to fetch all videos (for initial database population)
 */
export const fetchAllVideos = async (verbose = true): Promise<YouTubeVideo[]> => {
  return fetchRecentVideos({ fetchAll: true, verbose });
};
