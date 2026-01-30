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

// Matches names: "John Smith", "O'Brien", "de la Cruz", single names like "Redban"
// Also handles ALL CAPS from auto-transcripts
const NAME_REGEX = /([A-Z][a-zA-Z'-]*(?:\s+(?:de\s+la\s+|van\s+|von\s+|O'|Mc|Mac)?[A-Z]?[a-zA-Z'-]+)*)/i;

const MENTION_PATTERNS: Array<{ pattern: RegExp; baseConfidence: number }> = [
  // High confidence - explicit intro phrases
  { pattern: /give it up for ([^.!?,]+)/i, baseConfidence: 0.92 },
  { pattern: /put your hands together for ([^.!?,]+)/i, baseConfidence: 0.90 },
  { pattern: /please welcome ([^.!?,]+)/i, baseConfidence: 0.90 },
  { pattern: /welcome to the stage ([^.!?,]+)/i, baseConfidence: 0.90 },

  // Medium-high confidence - common Kill Tony phrases
  { pattern: /your next comedian[,:]?\s*([^.!?,]+)/i, baseConfidence: 0.88 },
  { pattern: /coming to the stage[,:]?\s*([^.!?,]+)/i, baseConfidence: 0.88 },
  { pattern: /from the bucket[,:]?\s*([^.!?,]+)/i, baseConfidence: 0.86 },
  { pattern: /our next bucket pull[,:]?\s*([^.!?,]+)/i, baseConfidence: 0.86 },
  { pattern: /first[- ]time performer[,:]?\s*([^.!?,]+)/i, baseConfidence: 0.85 },

  // Medium confidence - generic intros
  { pattern: /next up[,:]?\s*([^.!?,]+)/i, baseConfidence: 0.82 },
  { pattern: /here['']?s ([^.!?,]+)/i, baseConfidence: 0.78 },
  { pattern: /it['']?s ([^.!?,]+)/i, baseConfidence: 0.70 },

  // Lower confidence - may catch regulars
  { pattern: /ladies and gentlemen[,:]?\s*([^.!?,]+)/i, baseConfidence: 0.75 },
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

// Known Kill Tony regulars and band members to filter out (they're not bucket pull contestants)
const EXCLUDED_NAMES = new Set([
  "tony hinchcliffe",
  "tony",
  "brian redban",
  "redban",
  "william montgomery",
  "david lucas",
  "hans kim",
  "kam patterson",
  "the band",
  "joel",
  "everybody",
  "the crowd",
  "austin",
  "texas",
]);

const isValidContestantName = (name: string): boolean => {
  const lower = name.toLowerCase();

  // Filter out excluded names (regulars/hosts - unless we want to track them too)
  // Comment this out if you want to include regulars
  // if (EXCLUDED_NAMES.has(lower)) return false;

  // Must be at least 2 characters
  if (name.length < 2) return false;

  // Filter out likely non-names (numbers, common words)
  if (/^\d+$/.test(name)) return false;
  if (/^(the|a|an|this|that|here|there|and|or|but)$/i.test(name)) return false;

  return true;
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
      if (!match || !match[1]) {
        continue;
      }

      // Try to extract a name from the captured group
      const captured = match[1].trim();
      const nameMatch = captured.match(NAME_REGEX);
      const possibleName = nameMatch?.[1] || captured.split(/[,!?.]/)[0];

      if (!possibleName) {
        continue;
      }

      const contestantName = normalizeName(possibleName);
      if (!contestantName || !isValidContestantName(contestantName)) {
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
