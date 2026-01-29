import { config } from "dotenv";
import { resolve } from "path";

// Load .env from project root (two levels up from apps/worker/src)
config({ path: resolve(__dirname, "../../../.env") });

import { extractEpisodes } from "./pipeline/extract";
import { extractPerformances } from "./pipeline/performances";
import { persistEpisodes, persistPerformances } from "./pipeline/persist";
import { fetchEpisodeTranscripts } from "./pipeline/transcripts";
import { fetchRecentVideos } from "./sources/youtube";

const run = async () => {
  const videos = await fetchRecentVideos();
  const episodes = extractEpisodes(videos);
  const transcriptsByVideo = await fetchEpisodeTranscripts(videos);
  const performances = extractPerformances(videos, transcriptsByVideo);

  if (episodes.length === 0) {
    console.warn("No videos found. Check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID.");
    return;
  }

  console.info(`Fetched ${episodes.length} episodes from YouTube.`);

  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set. Skipping persistence.");
    console.info(episodes);
    console.info(performances);
    return;
  }

  await persistEpisodes(episodes);
  await persistPerformances(performances);
  console.info("Episodes persisted to Postgres.");
};

run().catch((error) => {
  console.error("Worker pipeline failed", error);
  process.exit(1);
});
