export type ConfidenceLevel = "High" | "Medium" | "Low";

export type Performance = {
  id: string;
  contestantName: string;
  contestantId: string;
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeDate: string;
  timestampSeconds: number;
  timestampLabel: string;
  youtubeUrl: string;
  youtubeJumpUrl: string;
  snippet: string;
  ratingAvg: number;
  ratingCount: number;
  commentCount: number;
  confidence: ConfidenceLevel;
};

export type Episode = {
  id: string;
  number: number;
  title: string;
  date: string;
  youtubeUrl: string;
  guests: string[];
  performanceCount: number;
  avgRating: number;
};

export type Contestant = {
  id: string;
  name: string;
  appearances: number;
  avgRating: number;
  bestPerformanceId: string;
};

export const formatTimestamp = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const buildYouTubeJumpUrl = (youtubeUrl: string, seconds: number): string => {
  if (!youtubeUrl) return "#";
  const url = new URL(youtubeUrl);
  const joiner = url.search ? "&" : "?";
  return `${youtubeUrl}${joiner}t=${seconds}`;
};

export const buildYouTubeEmbedUrl = (youtubeUrl: string, seconds = 0): string => {
  if (!youtubeUrl) return "";
  const url = new URL(youtubeUrl);
  const videoId = url.searchParams.get("v");
  if (!videoId) return youtubeUrl;
  const startParam = seconds > 0 ? `?start=${seconds}` : "";
  return `https://www.youtube.com/embed/${videoId}${startParam}`;
};

const rawPerformances: Omit<Performance, "timestampLabel" | "youtubeJumpUrl">[] = [
  {
    id: "perf-001",
    contestantName: "Casey Rocket",
    contestantId: "contestant-001",
    episodeId: "episode-650",
    episodeNumber: 650,
    episodeTitle: "Kill Tony #650",
    episodeDate: "2024-02-12",
    timestampSeconds: 4994,
    youtubeUrl: "https://www.youtube.com/watch?v=kt-650",
    snippet: "Opens with a blitz of punchlines and a no-scrubbing crowd riff.",
    ratingAvg: 9.4,
    ratingCount: 482,
    commentCount: 96,
    confidence: "High",
  },
  {
    id: "perf-002",
    contestantName: "Kim Congdon",
    contestantId: "contestant-002",
    episodeId: "episode-651",
    episodeNumber: 651,
    episodeTitle: "Kill Tony #651",
    episodeDate: "2024-02-19",
    timestampSeconds: 3725,
    youtubeUrl: "https://www.youtube.com/watch?v=kt-651",
    snippet: "A tight callback run that lands every beat.",
    ratingAvg: 8.9,
    ratingCount: 331,
    commentCount: 54,
    confidence: "High",
  },
  {
    id: "perf-003",
    contestantName: "William Montgomery",
    contestantId: "contestant-003",
    episodeId: "episode-649",
    episodeNumber: 649,
    episodeTitle: "Kill Tony #649",
    episodeDate: "2024-02-05",
    timestampSeconds: 5520,
    youtubeUrl: "https://www.youtube.com/watch?v=kt-649",
    snippet: "Chaotic energy, perfect timing, and a legendary punch.",
    ratingAvg: 9.1,
    ratingCount: 275,
    commentCount: 63,
    confidence: "Medium",
  },
  {
    id: "perf-004",
    contestantName: "Ari Matti",
    contestantId: "contestant-004",
    episodeId: "episode-652",
    episodeNumber: 652,
    episodeTitle: "Kill Tony #652",
    episodeDate: "2024-02-26",
    timestampSeconds: 2580,
    youtubeUrl: "https://www.youtube.com/watch?v=kt-652",
    snippet: "New material with a clean setup-payoff run.",
    ratingAvg: 8.3,
    ratingCount: 198,
    commentCount: 41,
    confidence: "Medium",
  },
  {
    id: "perf-005",
    contestantName: "Hans Kim",
    contestantId: "contestant-005",
    episodeId: "episode-648",
    episodeNumber: 648,
    episodeTitle: "Kill Tony #648",
    episodeDate: "2024-01-29",
    timestampSeconds: 3108,
    youtubeUrl: "https://www.youtube.com/watch?v=kt-648",
    snippet: "A fast opener and an instant crowd win.",
    ratingAvg: 8.7,
    ratingCount: 214,
    commentCount: 49,
    confidence: "High",
  },
  {
    id: "perf-006",
    contestantName: "Ali Macofsky",
    contestantId: "contestant-006",
    episodeId: "episode-647",
    episodeNumber: 647,
    episodeTitle: "Kill Tony #647",
    episodeDate: "2024-01-22",
    timestampSeconds: 1840,
    youtubeUrl: "https://www.youtube.com/watch?v=kt-647",
    snippet: "Short set, high hit rate, zero dead air.",
    ratingAvg: 8.1,
    ratingCount: 162,
    commentCount: 32,
    confidence: "Low",
  },
];

export const performances: Performance[] = rawPerformances.map((performance) => ({
  ...performance,
  timestampLabel: formatTimestamp(performance.timestampSeconds),
  youtubeJumpUrl: buildYouTubeJumpUrl(performance.youtubeUrl, performance.timestampSeconds),
}));

export const episodes: Episode[] = [
  {
    id: "episode-652",
    number: 652,
    title: "Kill Tony #652",
    date: "2024-02-26",
    youtubeUrl: "https://www.youtube.com/watch?v=kt-652",
    guests: ["Shane Gillis", "Adam Ray"],
    performanceCount: 12,
    avgRating: 8.8,
  },
  {
    id: "episode-651",
    number: 651,
    title: "Kill Tony #651",
    date: "2024-02-19",
    youtubeUrl: "https://www.youtube.com/watch?v=kt-651",
    guests: ["Theo Von"],
    performanceCount: 11,
    avgRating: 8.6,
  },
  {
    id: "episode-650",
    number: 650,
    title: "Kill Tony #650",
    date: "2024-02-12",
    youtubeUrl: "https://www.youtube.com/watch?v=kt-650",
    guests: ["Mark Normand", "Joe List"],
    performanceCount: 10,
    avgRating: 8.9,
  },
  {
    id: "episode-649",
    number: 649,
    title: "Kill Tony #649",
    date: "2024-02-05",
    youtubeUrl: "https://www.youtube.com/watch?v=kt-649",
    guests: ["Ari Shaffir"],
    performanceCount: 9,
    avgRating: 8.4,
  },
];

export const contestants: Contestant[] = [
  {
    id: "contestant-001",
    name: "Casey Rocket",
    appearances: 14,
    avgRating: 9.1,
    bestPerformanceId: "perf-001",
  },
  {
    id: "contestant-002",
    name: "Kim Congdon",
    appearances: 9,
    avgRating: 8.8,
    bestPerformanceId: "perf-002",
  },
  {
    id: "contestant-003",
    name: "William Montgomery",
    appearances: 21,
    avgRating: 9.0,
    bestPerformanceId: "perf-003",
  },
  {
    id: "contestant-004",
    name: "Ari Matti",
    appearances: 7,
    avgRating: 8.4,
    bestPerformanceId: "perf-004",
  },
  {
    id: "contestant-005",
    name: "Hans Kim",
    appearances: 18,
    avgRating: 8.6,
    bestPerformanceId: "perf-005",
  },
  {
    id: "contestant-006",
    name: "Ali Macofsky",
    appearances: 6,
    avgRating: 8.2,
    bestPerformanceId: "perf-006",
  },
];

export const leaderboardRows = [...performances]
  .sort((a, b) => b.ratingAvg - a.ratingAvg)
  .map((performance) => ({
    id: performance.id,
    ratingAvg: performance.ratingAvg,
    ratingCount: performance.ratingCount,
    contestantName: performance.contestantName,
    contestantId: performance.contestantId,
    episodeNumber: performance.episodeNumber,
    episodeId: performance.episodeId,
    timestampLabel: performance.timestampLabel,
    youtubeJumpUrl: performance.youtubeJumpUrl,
}));

export const getPerformanceById = (id: string) =>
  performances.find((performance) => performance.id === id) || null;

export const getEpisodeById = (id: string) => episodes.find((episode) => episode.id === id) || null;

export const getContestantById = (id: string) =>
  contestants.find((contestant) => contestant.id === id) || null;

export const getPerformancesByEpisode = (episodeId: string) =>
  performances.filter((performance) => performance.episodeId === episodeId);

export const getPerformancesByContestant = (contestantId: string) =>
  performances.filter((performance) => performance.contestantId === contestantId);
