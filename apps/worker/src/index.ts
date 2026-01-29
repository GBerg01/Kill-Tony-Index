import { extractEpisodes } from "./pipeline/extract";
import { persistEpisodes, persistPerformances } from "./pipeline/persist";
import { extractPerformances } from "./pipeline/performances";
import { fetchRecentVideos } from "./sources/youtube";
import { fetchTranscript } from "./sources/transcript";

const run = async () => {
  console.info("Starting Kill Tony worker pipeline...\n");

  // Step 1: Fetch recent videos from YouTube
  console.info("Step 1: Fetching recent videos from YouTube...");
  const videos = await fetchRecentVideos();
  const episodes = extractEpisodes(videos);

  if (episodes.length === 0) {
    console.warn("No videos found. Check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID.");
    return;
  }

  console.info(`Found ${episodes.length} episodes.\n`);

  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set. Skipping persistence.");
    console.info("Episodes:", episodes);
    return;
  }

  // Step 2: Persist episodes to database
  console.info("Step 2: Persisting episodes to database...");
  await persistEpisodes(episodes);
  console.info("Episodes persisted.\n");

  // Step 3: For each episode, fetch transcript and extract performances
  console.info("Step 3: Processing transcripts and extracting performances...\n");

  for (const episode of episodes) {
    console.info(`Processing: ${episode.title}`);

    // Fetch transcript
    const transcript = await fetchTranscript(episode.youtubeId);

    if (!transcript) {
      console.warn(`  No transcript available for ${episode.youtubeId}`);
      continue;
    }

    console.info(`  Transcript fetched: ${transcript.segments.length} segments`);

    // Extract performances from transcript
    const performances = extractPerformances(transcript);

    if (performances.length === 0) {
      console.warn(`  No performances detected in transcript`);
      continue;
    }

    console.info(`  Found ${performances.length} performances:`);
    for (const perf of performances) {
      console.info(`    - ${perf.contestantName} @ ${formatTime(perf.startSeconds)} (confidence: ${(perf.confidence * 100).toFixed(0)}%)`);
    }

    // Persist performances
    await persistPerformances(episode.youtubeId, performances);
    console.info("");
  }

  console.info("Worker pipeline completed successfully.");
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

run().catch((error) => {
  console.error("Worker pipeline failed", error);
  process.exit(1);
});
