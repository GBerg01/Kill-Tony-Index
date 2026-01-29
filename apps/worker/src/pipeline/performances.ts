import type { Transcript, TranscriptSegment } from "../sources/transcript";

export type ExtractedPerformance = {
  contestantName: string;
  startSeconds: number;
  endSeconds: number;
  introSnippet: string;
  confidence: number;
};

/**
 * Common introduction patterns used on Kill Tony
 * These patterns indicate the start of a contestant's set
 */
const INTRO_PATTERNS = [
  /(?:please welcome|put your hands together for|give it up for|here(?:'s| is)|coming to the stage|next up is?|let's hear it for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i,
  /(?:our next comedian is|we have|introducing)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i,
  /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),?\s+(?:come on up|take the stage|you're up)/i,
];

/**
 * Patterns that indicate the end of a set / transition
 */
const OUTRO_PATTERNS = [
  /(?:thank you|thanks)\s+([A-Z][a-z]+)/i,
  /give it up (?:for|one more time)/i,
  /(?:that was|let's hear it for)\s+([A-Z][a-z]+)/i,
  /(?:alright|okay|all right),?\s+(?:next|moving on|let's)/i,
];

/**
 * Average Kill Tony set duration in seconds (about 60 seconds)
 */
const TYPICAL_SET_DURATION = 60;
const MIN_SET_DURATION = 30;
const MAX_SET_DURATION = 120;

/**
 * Extract performances from a transcript
 */
export function extractPerformances(transcript: Transcript): ExtractedPerformance[] {
  const performances: ExtractedPerformance[] = [];
  const segments = transcript.segments;

  if (segments.length === 0) {
    return performances;
  }

  // Build a searchable text with timestamp mapping
  const textWithTimestamps = buildTextWithTimestamps(segments);

  // Find all potential introductions
  const introductions = findIntroductions(textWithTimestamps);

  for (let i = 0; i < introductions.length; i++) {
    const intro = introductions[i];
    const nextIntro = introductions[i + 1];

    // Estimate end time: either next intro or typical set duration
    let endSeconds: number;
    if (nextIntro) {
      // End a bit before the next intro
      endSeconds = Math.min(
        intro.startSeconds + MAX_SET_DURATION,
        nextIntro.startSeconds - 5
      );
    } else {
      // Last performance - use typical duration
      endSeconds = intro.startSeconds + TYPICAL_SET_DURATION;
    }

    // Ensure minimum duration
    if (endSeconds - intro.startSeconds < MIN_SET_DURATION) {
      endSeconds = intro.startSeconds + MIN_SET_DURATION;
    }

    // Calculate confidence based on pattern match quality
    const confidence = calculateConfidence(intro);

    // Get intro snippet (text around the introduction)
    const introSnippet = getIntroSnippet(segments, intro.startSeconds);

    performances.push({
      contestantName: normalizeContestantName(intro.name),
      startSeconds: Math.floor(intro.startSeconds),
      endSeconds: Math.floor(endSeconds),
      introSnippet,
      confidence,
    });
  }

  return performances;
}

type TextWithTimestamp = {
  text: string;
  startSeconds: number;
  segmentIndex: number;
};

function buildTextWithTimestamps(segments: TranscriptSegment[]): TextWithTimestamp[] {
  return segments.map((segment, index) => ({
    text: segment.text,
    startSeconds: segment.startSeconds,
    segmentIndex: index,
  }));
}

type Introduction = {
  name: string;
  startSeconds: number;
  patternIndex: number;
  matchText: string;
};

function findIntroductions(textWithTimestamps: TextWithTimestamp[]): Introduction[] {
  const introductions: Introduction[] = [];
  const usedNames = new Set<string>();

  // Combine nearby segments for better pattern matching
  for (let i = 0; i < textWithTimestamps.length; i++) {
    // Build a window of text (current + next few segments)
    const windowSize = 5;
    const windowSegments = textWithTimestamps.slice(i, i + windowSize);
    const windowText = windowSegments.map((s) => s.text).join(" ");

    // Try each intro pattern
    for (let patternIndex = 0; patternIndex < INTRO_PATTERNS.length; patternIndex++) {
      const pattern = INTRO_PATTERNS[patternIndex];
      const match = windowText.match(pattern);

      if (match && match[1]) {
        const name = match[1].trim();

        // Skip if we already found this name (avoid duplicates)
        const normalizedName = name.toLowerCase();
        if (usedNames.has(normalizedName)) {
          continue;
        }

        // Skip common false positives
        if (isCommonFalsePositive(name)) {
          continue;
        }

        usedNames.add(normalizedName);
        introductions.push({
          name,
          startSeconds: textWithTimestamps[i].startSeconds,
          patternIndex,
          matchText: match[0],
        });

        // Skip ahead to avoid duplicate matches
        i += windowSize - 1;
        break;
      }
    }
  }

  return introductions;
}

/**
 * Common words that might match patterns but aren't contestant names
 */
const FALSE_POSITIVES = new Set([
  "tony",
  "redban",
  "brian",
  "william",
  "montgomery",
  "the band",
  "band",
  "everyone",
  "everybody",
  "you",
  "me",
  "him",
  "her",
  "them",
  "us",
  "austin",
  "texas",
  "america",
  "kill tony",
]);

function isCommonFalsePositive(name: string): boolean {
  const lower = name.toLowerCase();
  return FALSE_POSITIVES.has(lower) || lower.length < 3;
}

function normalizeContestantName(name: string): string {
  // Capitalize each word properly
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function calculateConfidence(intro: Introduction): number {
  let confidence = 0.5;

  // Higher confidence for more specific patterns (earlier in the list)
  if (intro.patternIndex === 0) {
    confidence += 0.3;
  } else if (intro.patternIndex === 1) {
    confidence += 0.2;
  } else {
    confidence += 0.1;
  }

  // Higher confidence for full names (first + last)
  const wordCount = intro.name.split(" ").length;
  if (wordCount >= 2) {
    confidence += 0.15;
  }

  // Cap at 0.95 since we're never 100% sure without manual verification
  return Math.min(confidence, 0.95);
}

function getIntroSnippet(segments: TranscriptSegment[], startSeconds: number): string {
  // Get text from a few seconds before to a few seconds after the intro
  const snippetSegments = segments.filter(
    (s) => s.startSeconds >= startSeconds - 5 && s.startSeconds <= startSeconds + 10
  );

  const snippet = snippetSegments.map((s) => s.text).join(" ");

  // Truncate if too long
  if (snippet.length > 200) {
    return snippet.slice(0, 197) + "...";
  }

  return snippet;
}
