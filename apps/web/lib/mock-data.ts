import type { Contestant, Episode, Performance } from "@killtony/shared/src/types";

export const episodes: Episode[] = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    youtubeId: "yt-episode-001",
    title: "Kill Tony #650",
    publishedAt: "2024-01-01",
    durationSeconds: 7200,
    youtubeUrl: "https://www.youtube.com/watch?v=yt-episode-001",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    youtubeId: "yt-episode-002",
    title: "Kill Tony #651",
    publishedAt: "2024-01-08",
    durationSeconds: 7100,
    youtubeUrl: "https://www.youtube.com/watch?v=yt-episode-002",
  },
];

export const contestants: Contestant[] = [
  {
    id: "66666666-6666-6666-6666-666666666666",
    displayName: "Contestant One",
    aliases: ["C-One"],
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    displayName: "Contestant Two",
    aliases: [],
  },
];

export const performances: Performance[] = [
  {
    id: "99999999-9999-9999-9999-999999999999",
    episodeId: "22222222-2222-2222-2222-222222222222",
    contestantId: "66666666-6666-6666-6666-666666666666",
    startSeconds: 120,
    endSeconds: 420,
    confidence: 0.923,
    introSnippet: "Opening minute set with crowd work.",
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    episodeId: "33333333-3333-3333-3333-333333333333",
    contestantId: "77777777-7777-7777-7777-777777777777",
    startSeconds: 300,
    endSeconds: 540,
    confidence: 0.881,
    introSnippet: "High-energy set with audience riffing.",
  },
];
