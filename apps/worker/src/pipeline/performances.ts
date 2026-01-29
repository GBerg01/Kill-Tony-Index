import type { TranscriptSegment } from "../sources/transcripts";
import type { YouTubeVideo } from "../sources/youtube";

type CandidateMention = {
  contestantName: string;
  startSeconds: number;
  introSnippet: string;
  confidence: number;
  endSeconds?: number | null;
};

export type ExtractedPerformance = {
  episodeYoutubeId: string;
  contestantName: string;
  startSeconds: number;
  endSeconds: number | null;
  confidence: number;
  introSnippet: string;
};

const NAME_REGEX = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/;

const MENTION_PATTERNS: Array<{ pattern: RegExp; baseConfidence: number }> = [
  { pattern: /give it up for ([^.!?]+)/i, baseConfidence: 0.88 },
  { pattern: /put your hands together for ([^.!?]+)/i, baseConfidence: 0.86 },
  { pattern: /your next comedian ([^.!?]+)/i, baseConfidence: 0.84 },
  { pattern: /next up ([^.!?]+)/i, baseConfidence: 0.78 },
];

const normalizeName = (raw: string): string => {
  return raw
    .replace(/[^\w\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const scoreConfidence = (base: number, name: string, snippet: string): number => {
  let score = base;
  if (name.split(" ").length >= 2) {
    score += 0.05;
  }
  if (snippet.length > 40) {
    score += 0.03;
  }
  return Math.min(0.99, Math.max(0.1, score));
};

const extractMentions = (segments: TranscriptSegment[]): CandidateMention[] => {
  const mentions: CandidateMention[] = [];

  for (const segment of segments) {
    const text = segment.text;
    if (!text) {
      continue;
    }

    for (const { pattern, baseConfidence } of MENTION_PATTERNS) {
      const match = text.match(pattern);
      if (!match) {
        continue;
      }

      const possibleName = match[1]?.match(NAME_REGEX)?.[1];
      if (!possibleName) {
        continue;
      }

      const contestantName = normalizeName(possibleName);
      if (!contestantName) {
        continue;
      }

      const confidence = scoreConfidence(baseConfidence, contestantName, text);

      mentions.push({
        contestantName,
        startSeconds: Math.max(0, Math.floor(segment.start)),
        introSnippet: text.trim(),
        confidence,
      });
    }
  }

  return mentions;
};

const dedupeMentions = (mentions: CandidateMention[]): CandidateMention[] => {
  const sorted = [...mentions].sort((a, b) => a.startSeconds - b.startSeconds);
  const deduped: CandidateMention[] = [];
  const lastSeen = new Map<string, number>();

  for (const mention of sorted) {
    const lastStart = lastSeen.get(mention.contestantName);
    if (lastStart !== undefined && mention.startSeconds - lastStart < 120) {
      continue;
    }
    lastSeen.set(mention.contestantName, mention.startSeconds);
    deduped.push(mention);
  }

  return deduped;
};

const addEndTimes = (mentions: CandidateMention[]): CandidateMention[] => {
  return mentions.map((mention, index) => {
    const next = mentions[index + 1];
    if (!next) {
      return { ...mention, endSeconds: null };
    }
    return {
      ...mention,
      endSeconds: Math.max(mention.startSeconds + 30, next.startSeconds - 5),
    };
  });
};

export const extractPerformances = (
  videos: YouTubeVideo[],
  transcriptsByVideo: Map<string, TranscriptSegment[]>
): ExtractedPerformance[] => {
  const performances: ExtractedPerformance[] = [];

  for (const video of videos) {
    const segments = transcriptsByVideo.get(video.id) || [];
    if (segments.length === 0) {
      continue;
    }

    const mentions = dedupeMentions(extractMentions(segments));
    const withEndTimes = addEndTimes(mentions);

    withEndTimes.forEach((mention) => {
      performances.push({
        episodeYoutubeId: video.id,
        contestantName: mention.contestantName,
        startSeconds: mention.startSeconds,
        endSeconds: mention.endSeconds ?? null,
        confidence: mention.confidence,
        introSnippet: mention.introSnippet,
      });
    });
  }

  return performances;
};
