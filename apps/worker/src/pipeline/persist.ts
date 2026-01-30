import type { ExtractedEpisode } from "./extract";
import type { ExtractedPerformance } from "./performances";

import { getPrismaClient } from "@killtony/db";

export const persistEpisodes = async (episodes: ExtractedEpisode[]) => {
  const prisma = getPrismaClient();
  let created = 0;
  let updated = 0;

  for (const episode of episodes) {
    const existing = await prisma.episode.findUnique({
      where: { youtubeId: episode.youtubeId },
      select: { id: true },
    });

    await prisma.episode.upsert({
      where: { youtubeId: episode.youtubeId },
      update: {
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        publishedAt: new Date(episode.publishedAt),
        durationSeconds: episode.durationSeconds,
        youtubeUrl: episode.youtubeUrl,
      },
      create: {
        id: crypto.randomUUID(),
        youtubeId: episode.youtubeId,
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        publishedAt: new Date(episode.publishedAt),
        durationSeconds: episode.durationSeconds,
        youtubeUrl: episode.youtubeUrl,
      },
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  console.info(`Episodes: ${created} created, ${updated} updated`);
};

export const persistPerformances = async (performances: ExtractedPerformance[]) => {
  if (performances.length === 0) {
    console.info("Performances: No performances to persist");
    return;
  }

  const prisma = getPrismaClient();
  const episodeIds = Array.from(new Set(performances.map((perf) => perf.episodeYoutubeId)));
  const episodes = await prisma.episode.findMany({
    where: { youtubeId: { in: episodeIds } },
    select: { id: true, youtubeId: true },
  });
  const episodeIdByYoutubeId = new Map(episodes.map((episode: { youtubeId: string; id: string }) => [episode.youtubeId, episode.id]));

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let contestantsCreated = 0;

  for (const performance of performances) {
    const episodeId = episodeIdByYoutubeId.get(performance.episodeYoutubeId);
    if (!episodeId) {
      skipped++;
      continue;
    }

    let contestant = await prisma.contestant.findFirst({
      where: { displayName: performance.contestantName },
      select: { id: true },
    });

    if (!contestant) {
      contestant = await prisma.contestant.create({
        data: {
          id: crypto.randomUUID(),
          displayName: performance.contestantName,
        },
        select: { id: true },
      });
      contestantsCreated++;
    }

    const existing = await prisma.performance.findFirst({
      where: {
        episodeId,
        contestantId: contestant.id,
        startSeconds: performance.startSeconds,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.performance.update({
        where: { id: existing.id },
        data: {
          endSeconds: performance.endSeconds,
          confidence: performance.confidence,
          introSnippet: performance.introSnippet,
        },
      });
      updated++;
      continue;
    }

    await prisma.performance.create({
      data: {
        id: crypto.randomUUID(),
        episodeId,
        contestantId: contestant.id,
        startSeconds: performance.startSeconds,
        endSeconds: performance.endSeconds,
        confidence: performance.confidence,
        introSnippet: performance.introSnippet,
      },
    });
    created++;
  }

  console.info(`Performances: ${created} created, ${updated} updated, ${skipped} skipped`);
  console.info(`Contestants: ${contestantsCreated} new contestants created`);
};
