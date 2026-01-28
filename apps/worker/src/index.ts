import { extractEpisodes } from "./pipeline/extract";
import { fetchRecentVideos } from "./sources/youtube";

const run = async () => {
  const videos = await fetchRecentVideos();
  const episodes = extractEpisodes(videos);

  if (episodes.length === 0) {
    console.warn("No videos found. Check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID.");
    return;
  }

  console.info(`Fetched ${episodes.length} episodes from YouTube.`);
  console.info(episodes);
};

run().catch((error) => {
  console.error("Worker pipeline failed", error);
  process.exit(1);
});
