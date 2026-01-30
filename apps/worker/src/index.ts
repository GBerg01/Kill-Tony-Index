import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { extractEpisodes } from "./pipeline/extract";
import { extractPerformances } from "./pipeline/performances";
import { persistEpisodes, persistPerformances } from "./pipeline/persist";
import { fetchEpisodeTranscripts } from "./pipeline/transcripts";
import { fetchRecentVideos } from "./sources/youtube";

const run = async () => {
  const videos = await fetchRecentVideos();
  const episodes = extractEpisodes(videos);
  const transcriptsByVideo = await fetchEpisodeTranscripts(videos);

  // Debug: log transcript stats
  let videosWithTranscripts = 0;
  let totalSegments = 0;
  for (const [videoId, segments] of transcriptsByVideo) {
    if (segments.length > 0) {
      videosWithTranscripts++;
      totalSegments += segments.length;
      // Show sample of first transcript
      if (videosWithTranscripts === 1) {
        console.log(`Sample transcript from ${videoId}:`, segments.slice(0, 5));
      }
    }
  }
  console.log(`Transcripts: ${videosWithTranscripts}/${videos.length} videos have transcripts (${totalSegments} total segments)`);

  const performances = extractPerformances(videos, transcriptsByVideo);
  console.log(`Extracted ${performances.length} performances`);

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
