export type TranscriptSegment = {
  text: string;
  startSeconds: number;
  durationSeconds: number;
};

export type Transcript = {
  videoId: string;
  segments: TranscriptSegment[];
  fullText: string;
};

/**
 * Fetch transcript/captions for a YouTube video
 * Uses the unofficial timedtext API that YouTube uses internally
 */
export async function fetchTranscript(videoId: string): Promise<Transcript | null> {
  try {
    // Step 1: Get the video page to extract caption track URL
    const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    if (!videoPageResponse.ok) {
      console.error(`Failed to fetch video page for ${videoId}`);
      return null;
    }

    const html = await videoPageResponse.text();

    // Extract the captions JSON from the page
    const captionsMatch = html.match(/"captions":\s*(\{[^}]+?"playerCaptionsTracklistRenderer"[^}]+\})/);
    if (!captionsMatch) {
      console.log(`No captions found for video ${videoId}`);
      return null;
    }

    // Try to find the timedtext URL in the page
    const timedtextMatch = html.match(/https:\/\/www\.youtube\.com\/api\/timedtext[^"]+/);
    if (!timedtextMatch) {
      // Alternative: look for captionTracks in ytInitialPlayerResponse
      const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);
      if (!playerResponseMatch) {
        console.log(`Could not extract player response for ${videoId}`);
        return null;
      }

      try {
        const playerResponse = JSON.parse(playerResponseMatch[1]);
        const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

        if (!captionTracks || captionTracks.length === 0) {
          console.log(`No caption tracks available for ${videoId}`);
          return null;
        }

        // Prefer English, fall back to first available
        const englishTrack = captionTracks.find(
          (track: { languageCode: string }) => track.languageCode === "en"
        );
        const track = englishTrack || captionTracks[0];

        if (!track?.baseUrl) {
          console.log(`No caption URL found for ${videoId}`);
          return null;
        }

        // Fetch the captions XML
        const captionsResponse = await fetch(track.baseUrl);
        if (!captionsResponse.ok) {
          console.error(`Failed to fetch captions for ${videoId}`);
          return null;
        }

        const captionsXml = await captionsResponse.text();
        return parseTranscriptXml(videoId, captionsXml);
      } catch (parseError) {
        console.error(`Failed to parse player response for ${videoId}:`, parseError);
        return null;
      }
    }

    // Fetch captions from timedtext URL
    const captionsUrl = timedtextMatch[0].replace(/\\u0026/g, "&");
    const captionsResponse = await fetch(captionsUrl);
    if (!captionsResponse.ok) {
      console.error(`Failed to fetch captions for ${videoId}`);
      return null;
    }

    const captionsXml = await captionsResponse.text();
    return parseTranscriptXml(videoId, captionsXml);
  } catch (error) {
    console.error(`Error fetching transcript for ${videoId}:`, error);
    return null;
  }
}

/**
 * Parse YouTube's XML caption format
 */
function parseTranscriptXml(videoId: string, xml: string): Transcript {
  const segments: TranscriptSegment[] = [];

  // Match all <text> elements with start and dur attributes
  const textRegex = /<text start="([\d.]+)" dur="([\d.]+)"[^>]*>([^<]*)<\/text>/g;
  let match;

  while ((match = textRegex.exec(xml)) !== null) {
    const startSeconds = parseFloat(match[1]);
    const durationSeconds = parseFloat(match[2]);
    // Decode HTML entities
    const text = decodeHtmlEntities(match[3]);

    if (text.trim()) {
      segments.push({
        text: text.trim(),
        startSeconds,
        durationSeconds,
      });
    }
  }

  const fullText = segments.map((s) => s.text).join(" ");

  return {
    videoId,
    segments,
    fullText,
  };
}

/**
 * Decode common HTML entities in transcript text
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}

/**
 * Get transcript segments within a time range
 */
export function getSegmentsInRange(
  transcript: Transcript,
  startSeconds: number,
  endSeconds: number
): TranscriptSegment[] {
  return transcript.segments.filter(
    (segment) =>
      segment.startSeconds >= startSeconds &&
      segment.startSeconds + segment.durationSeconds <= endSeconds
  );
}

/**
 * Get full text within a time range
 */
export function getTextInRange(
  transcript: Transcript,
  startSeconds: number,
  endSeconds: number
): string {
  return getSegmentsInRange(transcript, startSeconds, endSeconds)
    .map((s) => s.text)
    .join(" ");
}
