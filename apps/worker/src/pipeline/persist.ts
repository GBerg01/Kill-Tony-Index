import type { ExtractedEpisode } from "./extract";
import type { ExtractedPerformance } from "./performances";

import { getPrismaClient } from "@killtony/db";

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

export const persistPerformances = async (performances: ExtractedPerformance[]) => {
  if (performances.length === 0) {
    return;
  }

  const prisma = getPrismaClient();
  const episodeIds = Array.from(new Set(performances.map((perf) => perf.episodeYoutubeId)));
  const episodes = await prisma.episode.findMany({
    where: { youtubeId: { in: episodeIds } },
    select: { id: true, youtubeId: true },
  });
  const episodeIdByYoutubeId = new Map(episodes.map((episode) => [episode.youtubeId, episode.id]));

  for (const performance of performances) {
    const episodeId = episodeIdByYoutubeId.get(performance.episodeYoutubeId);
    if (!episodeId) {
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
  }
};
