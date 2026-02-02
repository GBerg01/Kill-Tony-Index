import { extractEpisodes } from "./pipeline/extract";
import { extractPerformances } from "./pipeline/performances";
import { persistEpisodes, persistPerformances } from "./pipeline/persist";
import { fetchEpisodeTranscripts } from "./pipeline/transcripts";
import { fetchRecentVideos, fetchAllVideos } from "./sources/youtube";

type RunMode = "recent" | "full" | "dry-run";

const parseArgs = (): { mode: RunMode; maxVideos: number } => {
  const args = process.argv.slice(2);
  let mode: RunMode = "recent";
  let maxVideos = 50;

  for (const arg of args) {
    if (arg === "--full" || arg === "-f") {
      mode = "full";
    } else if (arg === "--dry-run" || arg === "-d") {
      mode = "dry-run";
    } else if (arg.startsWith("--max=")) {
      maxVideos = parseInt(arg.split("=")[1], 10);
    }
  }

  return { mode, maxVideos };
};

const printUsage = () => {
  console.info(`
Kill Tony Index Worker
======================
Usage: npm run dev [options]

Options:
  --full, -f     Fetch ALL videos from the channel (for initial population)
  --dry-run, -d  Fetch and extract but don't persist to database
  --max=N        Maximum number of videos to fetch (default: 50)

Examples:
  npm run dev                  # Fetch 50 most recent videos
  npm run dev -- --max=100     # Fetch 100 most recent videos
  npm run dev -- --full        # Fetch ALL videos (for initial DB population)
  npm run dev -- --dry-run     # Test extraction without writing to DB
`);
};

const run = async () => {
  const { mode, maxVideos } = parseArgs();

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printUsage();
    return;
  }

  const missingEnvVars = ["YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID"].filter(
    (key) => !process.env[key]
  );

  if (missingEnvVars.length > 0) {
    console.info(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
    console.info("Set them in your .env file at the repo root (see apps/worker/README.md).");
    console.info("Example:");
    console.info("  YOUTUBE_API_KEY=your-youtube-api-key");
    console.info("  YOUTUBE_CHANNEL_ID=UCwzCMiicL-hBUzyjWiJaseg");
    return;
  }

  console.info("=".repeat(60));
  console.info("Kill Tony Index Worker");
  console.info("=".repeat(60));
  console.info(`Mode: ${mode}`);
  console.info(`Max videos: ${mode === "full" ? "unlimited" : maxVideos}`);
  console.info("");

  // Step 1: Fetch videos from YouTube
  console.info("Step 1/4: Fetching videos from YouTube...");
  const videos = mode === "full"
    ? await fetchAllVideos(true)
    : await fetchRecentVideos({ maxVideos, verbose: true });

  if (videos.length === 0) {
    console.warn("No videos found. Check YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID.");
    return;
  }

  console.info(`Total videos fetched: ${videos.length}`);
  console.info("");

  // Step 2: Extract episodes (filter Kill Tony episodes and parse metadata)
  console.info("Step 2/4: Extracting episode metadata...");
  const episodes = extractEpisodes(videos);
  console.info(`Kill Tony episodes identified: ${episodes.length}`);

  const withEpisodeNumber = episodes.filter((e) => e.episodeNumber !== null).length;
  console.info(`Episodes with episode number: ${withEpisodeNumber}`);
  console.info("");

  // Step 3: Fetch transcripts
  console.info("Step 3/4: Fetching transcripts...");
  const transcriptsByVideo = await fetchEpisodeTranscripts(
    episodes.map((e) => ({ id: e.youtubeId, title: e.title, publishedAt: e.publishedAt, durationSeconds: e.durationSeconds, url: e.youtubeUrl })),
    { concurrency: 5, verbose: true }
  );
  console.info("");

  // Step 4: Extract performances from transcripts
  console.info("Step 4/4: Extracting performances...");
  const performances = extractPerformances(
    episodes.map((e) => ({ id: e.youtubeId, title: e.title, publishedAt: e.publishedAt, durationSeconds: e.durationSeconds, url: e.youtubeUrl })),
    transcriptsByVideo
  );
  console.info(`Total performances extracted: ${performances.length}`);

  const avgPerEpisode = episodes.length > 0 ? (performances.length / episodes.length).toFixed(1) : 0;
  console.info(`Average performances per episode: ${avgPerEpisode}`);

  const uniqueContestants = new Set(performances.map((p) => p.contestantName.toLowerCase()));
  console.info(`Unique contestants found: ${uniqueContestants.size}`);
  console.info("");

  // Summary
  console.info("=".repeat(60));
  console.info("EXTRACTION SUMMARY");
  console.info("=".repeat(60));
  console.info(`Episodes: ${episodes.length}`);
  console.info(`Performances: ${performances.length}`);
  console.info(`Unique contestants: ${uniqueContestants.size}`);
  console.info("");

  // Dry run mode - don't persist
  if (mode === "dry-run") {
    console.info("DRY RUN MODE - Not persisting to database");
    console.info("");

    // Show sample data
    console.info("Sample episodes:");
    episodes.slice(0, 3).forEach((e) => {
      console.info(`  - ${e.title} (Ep #${e.episodeNumber ?? "?"})`);
    });

    console.info("");
    console.info("Sample performances:");
    performances.slice(0, 5).forEach((p) => {
      console.info(`  - ${p.contestantName} @ ${Math.floor(p.startSeconds / 60)}:${(p.startSeconds % 60).toString().padStart(2, "0")} (confidence: ${p.confidence.toFixed(2)})`);
    });

    return;
  }

  // Check for database
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set. Skipping persistence.");
    console.info("Use --dry-run to see extracted data without a database.");
    return;
  }

  // Persist to database
  console.info("Persisting to database...");
  await persistEpisodes(episodes);
  await persistPerformances(performances);

  console.info("");
  console.info("=".repeat(60));
  console.info("DONE!");
  console.info("=".repeat(60));
};

run().catch((error) => {
  console.error("Worker pipeline failed:", error);
  process.exit(1);
});
