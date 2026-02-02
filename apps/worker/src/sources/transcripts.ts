export type TranscriptSegment = {
  text: string;
  start: number;
  duration: number;
};

export type TranscriptFetchStatus = "ok" | "missing" | "error";

export type TranscriptFetchResult = {
  segments: TranscriptSegment[];
  status: TranscriptFetchStatus;
  reason?: string;
};

type TranscriptOptions = {
  maxRetries?: number;
  retryDelayMs?: number;
  verbose?: boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeEntities = (text: string): string =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\n/g, " ")
    .trim();

const extractCaptionTracks = (html: string): unknown[] | null => {
  const marker = '"captionTracks":';
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }

  const startIndex = html.indexOf("[", markerIndex);
  if (startIndex === -1) {
    return null;
  }

  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < html.length; i += 1) {
    const char = html[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }

  if (endIndex === -1) {
    return null;
  }

  const raw = html.slice(startIndex, endIndex);

  try {
    return JSON.parse(raw) as unknown[];
  } catch {
    return null;
  }
};

const getCaptionUrl = async (videoId: string): Promise<string | null> => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const tracks = extractCaptionTracks(html);

  if (!tracks || tracks.length === 0) {
    return null;
  }

  const trackList = tracks.filter(
    (track) => track && typeof track === "object"
  ) as Array<{
    baseUrl?: string;
    languageCode?: string;
    kind?: string;
  }>;

  const english = trackList.find(
    (track) => track.languageCode === "en" && track.kind !== "asr"
  );
  const autoEnglish = trackList.find(
    (track) => track.languageCode === "en" && track.kind === "asr"
  );
  const fallback = trackList[0];

  return english?.baseUrl ?? autoEnglish?.baseUrl ?? fallback?.baseUrl ?? null;
};

const parseTimedTextXml = (xml: string): TranscriptSegment[] => {
  const segments: TranscriptSegment[] = [];
  const regex = /<text\s+start="([^"]+)"\s+dur="([^"]+)"[^>]*>([\s\S]*?)<\/text>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(xml)) !== null) {
    const start = Number.parseFloat(match[1]);
    const duration = Number.parseFloat(match[2]);
    const text = decodeEntities(match[3]);

    if (text && !Number.isNaN(start)) {
      segments.push({ text, start, duration });
    }
  }

  return segments;
};

/**
 * Fetch transcript by scraping YouTube's caption tracks directly.
 */
export const fetchTranscript = async (
  videoId: string,
  options: TranscriptOptions = {}
): Promise<TranscriptFetchResult> => {
  const { maxRetries = 3, retryDelayMs = 1000, verbose = false } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const captionUrl = await getCaptionUrl(videoId);
      if (!captionUrl) {
        if (verbose) {
          console.info(`No captions found for ${videoId}`);
        }
        return { segments: [], status: "missing", reason: "No captions found" };
      }

      const response = await fetch(captionUrl);
      if (!response.ok) {
        throw new Error(`Caption fetch HTTP ${response.status}`);
      }

      const xml = await response.text();
      const segments = parseTimedTextXml(xml);

      if (verbose && segments.length > 0) {
        console.info(`Fetched ${segments.length} transcript segments for ${videoId}`);
      }

      if (segments.length === 0) {
        return { segments, status: "missing", reason: "Empty transcript payload" };
      }

      return { segments, status: "ok" };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        if (verbose) {
          console.warn(
            `Attempt ${attempt}/${maxRetries} failed for ${videoId}: ${lastError.message}`
          );
        }
        await sleep(retryDelayMs * attempt);
      }
    }
  }

  if (verbose) {
    console.error(
      `Failed to fetch transcript for ${videoId} after ${maxRetries} attempts: ${lastError?.message}`
    );
  }

  return { segments: [], status: "error", reason: lastError?.message };
};
