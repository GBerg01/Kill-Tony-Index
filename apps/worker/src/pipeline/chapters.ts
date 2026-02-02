import type { YouTubeVideo } from "../sources/youtube";
import type { ExtractedPerformance } from "./performances";

type ChapterEntry = {
  startSeconds: number;
  label: string;
};

const TIMESTAMP_REGEX =
  /^(?<time>(?:\d{1,2}:)?\d{1,2}:\d{2})\s*(?:[-–—]|\||•)?\s*(?<label>.+)$/;

const NAME_REGEX = /([A-Z][a-zA-Z'-]*(?:\s+(?:de\s+la\s+|van\s+|von\s+|O'|Mc|Mac)?[A-Z]?[a-zA-Z'-]+)*)/i;

const INVALID_LABELS = new Set([
  "intro",
  "introduction",
  "housekeeping",
  "sponsors",
  "sponsor",
  "ads",
  "ad",
  "intermission",
  "outro",
  "closing",
  "credits",
  "band",
]);

const parseTimestampToSeconds = (value: string): number | null => {
  const parts = value.split(":").map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return null;
};

const extractChapters = (description?: string): ChapterEntry[] => {
  if (!description) {
    return [];
  }

  const chapters: ChapterEntry[] = [];
  const lines = description.split(/\r?\n/);

  for (const line of lines) {
    const match = line.trim().match(TIMESTAMP_REGEX);
    if (!match?.groups?.time || !match?.groups?.label) {
      continue;
    }

    const startSeconds = parseTimestampToSeconds(match.groups.time);
    if (startSeconds === null) {
      continue;
    }

    const label = match.groups.label.trim();
    if (!label) {
      continue;
    }

    chapters.push({ startSeconds, label });
  }

  return chapters.sort((a, b) => a.startSeconds - b.startSeconds);
};

const normalizeName = (name: string): string =>
  name
    .replace(/[^\w\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const extractContestantName = (label: string): string | null => {
  const cleaned = label.replace(/\([^)]*\)/g, "").trim();
  if (!cleaned) {
    return null;
  }

  const lower = cleaned.toLowerCase();
  if (INVALID_LABELS.has(lower)) {
    return null;
  }

  const nameMatch = cleaned.match(NAME_REGEX);
  if (!nameMatch?.[1]) {
    return null;
  }

  const name = normalizeName(nameMatch[1]);
  if (name.length < 2) {
    return null;
  }

  return name;
};

export const extractPerformancesFromChapters = (
  videos: YouTubeVideo[]
): ExtractedPerformance[] => {
  const performances: ExtractedPerformance[] = [];

  for (const video of videos) {
    const chapters = extractChapters(video.description);
    if (chapters.length === 0) {
      continue;
    }

    chapters.forEach((chapter, index) => {
      const contestantName = extractContestantName(chapter.label);
      if (!contestantName) {
        return;
      }

      const next = chapters[index + 1];

      performances.push({
        episodeYoutubeId: video.id,
        contestantName,
        startSeconds: Math.max(0, Math.floor(chapter.startSeconds)),
        endSeconds: next ? Math.max(chapter.startSeconds + 30, next.startSeconds - 5) : null,
        confidence: 0.95,
        introSnippet: chapter.label,
      });
    });
  }

  return performances;
};
