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

const normalizeSegment = (segment: TranscriptApiSegment): TranscriptSegment => ({
  text: segment.text,
  start: Number(segment.start),
  duration: Number(segment.duration),
});

export const fetchTranscript = async (videoId: string): Promise<TranscriptSegment[]> => {
  const response = await fetch(`https://youtubetranscript.com/?server_vid2=${videoId}`);

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as TranscriptApiSegment[];

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map(normalizeSegment)
    .filter((segment) => segment.text && !Number.isNaN(segment.start));
};
