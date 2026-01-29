import type { ExtractedEpisode } from "./extract";
import type { ExtractedPerformance } from "./performances";

import { getPrismaClient } from "@killtony/db";
import { Decimal } from "@prisma/client/runtime/library";

export const persistEpisodes = async (episodes: ExtractedEpisode[]) => {
  const prisma = getPrismaClient();

  for (const episode of episodes) {
    await prisma.episode.upsert({
      where: { youtubeId: episode.youtubeId },
      update: {
        title: episode.title,
        publishedAt: new Date(episode.publishedAt),
        durationSeconds: episode.durationSeconds,
        youtubeUrl: episode.youtubeUrl,
      },
      create: {
        id: crypto.randomUUID(),
        youtubeId: episode.youtubeId,
        title: episode.title,
        publishedAt: new Date(episode.publishedAt),
        durationSeconds: episode.durationSeconds,
        youtubeUrl: episode.youtubeUrl,
      },
    });
  }
};

/**
 * Find or create a contestant by name
 */
async function findOrCreateContestant(name: string): Promise<string> {
  const prisma = getPrismaClient();

  // First, try to find by exact name match
  let contestant = await prisma.contestant.findFirst({
    where: { displayName: name },
  });

  if (contestant) {
    return contestant.id;
  }

  // Try to find by alias
  const alias = await prisma.contestantAlias.findFirst({
    where: { alias: name },
    include: { contestant: true },
  });

  if (alias) {
    return alias.contestant.id;
  }

  // Create new contestant
  contestant = await prisma.contestant.create({
    data: {
      id: crypto.randomUUID(),
      displayName: name,
    },
  });

  return contestant.id;
}

/**
 * Persist extracted performances for an episode
 */
export const persistPerformances = async (
  episodeYoutubeId: string,
  performances: ExtractedPerformance[]
) => {
  const prisma = getPrismaClient();

  // Get the episode
  const episode = await prisma.episode.findUnique({
    where: { youtubeId: episodeYoutubeId },
  });

  if (!episode) {
    console.error(`Episode not found: ${episodeYoutubeId}`);
    return;
  }

  for (const performance of performances) {
    // Find or create contestant
    const contestantId = await findOrCreateContestant(performance.contestantName);

    // Check if performance already exists (same episode + contestant + start time)
    const existing = await prisma.performance.findFirst({
      where: {
        episodeId: episode.id,
        contestantId,
        startSeconds: performance.startSeconds,
      },
    });

    if (existing) {
      // Update existing performance
      await prisma.performance.update({
        where: { id: existing.id },
        data: {
          endSeconds: performance.endSeconds,
          confidence: new Decimal(performance.confidence),
          introSnippet: performance.introSnippet,
        },
      });
    } else {
      // Create new performance
      await prisma.performance.create({
        data: {
          id: crypto.randomUUID(),
          episodeId: episode.id,
          contestantId,
          startSeconds: performance.startSeconds,
          endSeconds: performance.endSeconds,
          confidence: new Decimal(performance.confidence),
          introSnippet: performance.introSnippet,
        },
      });
    }
  }

  console.info(`Persisted ${performances.length} performances for episode ${episodeYoutubeId}`);
};
