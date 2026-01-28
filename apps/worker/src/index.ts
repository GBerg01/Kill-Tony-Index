import { extractEpisodes } from "./pipeline/extract";
import { persistEpisodes } from "./pipeline/persist";
import { fetchRecentVideos } from "./sources/youtube";

const run = async () => {
  const videos = await fetchRecentVideos();
  const episodes = extractEpisodes(videos);

  if (episodes.length === 0) {
    console.warn("No videos found. Check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID.");
    return;
  }

  console.info(`Fetched ${episodes.length} episodes from YouTube.`);

  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set. Skipping persistence.");
    console.info(episodes);
    return;
  }

  await persistEpisodes(episodes);
  console.info("Episodes persisted to Postgres.");
};

run().catch((error) => {
  console.error("Worker pipeline failed", error);
  process.exit(1);
});
