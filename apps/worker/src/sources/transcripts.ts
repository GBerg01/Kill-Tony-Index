export type TranscriptSegment = {
  text: string;
  start: number;
  duration: number;
};

type TranscriptApiSegment = {
  text: string;
  start: string | number;
  duration: string | number;
};

type TranscriptOptions = {
  maxRetries?: number;
  retryDelayMs?: number;
  verbose?: boolean;
};

const normalizeSegment = (segment: TranscriptApiSegment): TranscriptSegment => ({
  text: segment.text,
  start: Number(segment.start),
  duration: Number(segment.duration),
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch transcript from youtubetranscript.com with retry logic
 */
export const fetchTranscript = async (
  videoId: string,
  options: TranscriptOptions = {}
): Promise<TranscriptSegment[]> => {
  const { maxRetries = 3, retryDelayMs = 1000, verbose = false } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`https://youtubetranscript.com/?server_vid2=${videoId}`);

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait longer
          if (verbose) {
            console.warn(`Rate limited fetching transcript for ${videoId}, waiting...`);
          }
          await sleep(retryDelayMs * attempt * 2);
          continue;
        }

        if (response.status === 404) {
          // No transcript available for this video
          if (verbose) {
            console.info(`No transcript available for ${videoId}`);
          }
          return [];
        }

        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();

      // Check if response is valid JSON
      let payload: unknown;
      try {
        payload = JSON.parse(text);
      } catch {
        // Sometimes the service returns HTML error pages
        if (verbose) {
          console.warn(`Invalid JSON response for ${videoId}`);
        }
        await sleep(retryDelayMs * attempt);
        continue;
      }

      if (!Array.isArray(payload)) {
        if (verbose) {
          console.warn(`Unexpected response format for ${videoId}`);
        }
        return [];
      }

      const segments = (payload as TranscriptApiSegment[])
        .map(normalizeSegment)
        .filter((segment) => segment.text && !Number.isNaN(segment.start));

      if (verbose && segments.length > 0) {
        console.info(`Fetched ${segments.length} transcript segments for ${videoId}`);
      }

      return segments;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        if (verbose) {
          console.warn(`Attempt ${attempt}/${maxRetries} failed for ${videoId}: ${lastError.message}`);
        }
        await sleep(retryDelayMs * attempt);
      }
    }
  }

  if (verbose) {
    console.error(`Failed to fetch transcript for ${videoId} after ${maxRetries} attempts: ${lastError?.message}`);
  }

  return [];
};
