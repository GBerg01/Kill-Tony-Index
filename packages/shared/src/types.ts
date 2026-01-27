export type Episode = {
  id: string;
  youtubeId: string;
  title: string;
  publishedAt: string;
  durationSeconds: number;
  youtubeUrl: string;
};

export type Contestant = {
  id: string;
  displayName: string;
  aliases: string[];
};

export type Performance = {
  id: string;
  episodeId: string;
  contestantId: string;
  startSeconds: number;
  endSeconds?: number | null;
  confidence: number;
  introSnippet: string;
};
