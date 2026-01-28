import type { Contestant, Episode, Performance } from "./types";

export type ApiResponse<T> = {
  data: T;
};

export type EpisodesResponse = ApiResponse<Episode[]>;
export type ContestantsResponse = ApiResponse<Contestant[]>;
export type PerformancesResponse = ApiResponse<Performance[]>;
