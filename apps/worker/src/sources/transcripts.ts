import { YoutubeTranscript } from "youtube-transcript";

export type TranscriptSegment = {
  text: string;
  start: number;
  duration: number;
};

export const fetchTranscript = async (videoId: string): Promise<TranscriptSegment[]> => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    return transcript.map((segment) => ({
      text: segment.text,
      start: segment.offset / 1000, // Convert ms to seconds
      duration: segment.duration / 1000,
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch transcript for ${videoId}: ${message}`);
  }
};
