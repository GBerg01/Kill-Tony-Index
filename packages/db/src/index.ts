export { getDbPool } from "./client";
export { getPrismaClient } from "./prisma";
export { listEpisodes, getEpisodeById, getPerformancesByEpisodeId } from "./queries/episodes";
export type { PerformanceWithContestant } from "./queries/episodes";
export { listContestants, getContestantById, getPerformancesByContestantId } from "./queries/contestants";
export type { PerformanceWithEpisode } from "./queries/contestants";
export { listPerformances } from "./queries/performances";
