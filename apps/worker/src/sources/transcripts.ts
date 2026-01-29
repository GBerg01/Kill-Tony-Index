import { YoutubeTranscript } from "youtube-transcript";

export type TranscriptSegment = {
  text: string;
  start: number;
  duration: number;
};

export const fetchTranscript = async (videoId: string): Promise<TranscriptSegment[]> => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    return transcript
      .map((item) => ({
        text: item.text,
        start: item.offset / 1000, // offset is in milliseconds, convert to seconds
        duration: item.duration / 1000, // duration is in milliseconds, convert to seconds
      }))
      .filter((segment) => segment.text && !Number.isNaN(segment.start));
  } catch (error) {
    // Transcripts may not be available for all videos
    console.warn(`Failed to fetch transcript for ${videoId}:`, error instanceof Error ? error.message : error);
    return [];
  }
};
