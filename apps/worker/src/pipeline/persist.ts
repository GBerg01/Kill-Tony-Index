import type { ExtractedEpisode } from "./extract";

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
