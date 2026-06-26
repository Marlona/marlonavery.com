import { YoutubeTranscript } from 'youtube-transcript';
import type { RawCapture } from '../types.js';

function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/embed\/([^?&#]+)/,
    /youtube\.com\/shorts\/([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchTitle(videoId: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (res.ok) {
      const data = await res.json() as { title?: string };
      return data.title || videoId;
    }
  } catch {
    // fall through
  }
  return videoId;
}

export async function ingestYouTube(url: string): Promise<RawCapture> {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error(`Could not extract video ID from URL: ${url}`);
  }

  let transcriptItems: Array<{ text: string }>;
  try {
    transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (err) {
    throw new Error(
      `No transcript available for video ${videoId}. The video may have captions disabled or unavailable. (${String(err)})`
    );
  }

  if (!transcriptItems.length) {
    throw new Error(`Transcript is empty for video ${videoId}`);
  }

  const transcript = transcriptItems.map(t => t.text).join(' ').replace(/\s+/g, ' ').trim();
  const title = await fetchTitle(videoId);
  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return {
    sourceType: 'youtube',
    sourceRef: canonicalUrl,
    title,
    content: transcript,
    raw: JSON.stringify(transcriptItems, null, 2),
    rawExtension: 'json',
    meta: { videoId, channel: '' },
  };
}
