/**
 * YouTube ingestor: fetches a video's transcript (captions) and title.
 * Uses youtube-transcript (no API key) for captions and YouTube oEmbed for the title.
 */

import { YoutubeTranscript } from 'youtube-transcript';
import type { RawCapture } from '../types.js';

/**
 * Extract the 11-character video id from common YouTube URL shapes.
 */
export function parseVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      return id || null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      if (m) return m[1];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch the video title via YouTube's public oEmbed endpoint.
 * Falls back to the video id if the lookup fails.
 */
async function fetchTitle(url: string, videoId: string): Promise<{ title: string; author?: string }> {
  try {
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembed);
    if (res.ok) {
      const data = (await res.json()) as { title?: string; author_name?: string };
      return { title: data.title || `YouTube video ${videoId}`, author: data.author_name };
    }
  } catch {
    // ignore and fall through
  }
  return { title: `YouTube video ${videoId}` };
}

/**
 * Ingest a YouTube video into a RawCapture using its transcript.
 */
export async function ingestYouTube(url: string): Promise<RawCapture> {
  const videoId = parseVideoId(url);
  if (!videoId) {
    throw new Error(`Could not parse a YouTube video id from: ${url}`);
  }

  let segments: { text: string }[];
  try {
    segments = await YoutubeTranscript.fetchTranscript(videoId);
  } catch (error) {
    throw new Error(
      `No transcript available for YouTube video ${videoId} ` +
        `(the video may have captions disabled). Original error: ${(error as Error).message}`
    );
  }

  const transcript = segments
    .map((s) => s.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!transcript) {
    throw new Error(`Transcript for YouTube video ${videoId} was empty`);
  }

  const { title, author } = await fetchTitle(url, videoId);
  const meta: Record<string, string> = { videoId };
  if (author) meta.channel = author;

  return {
    sourceType: 'youtube',
    sourceRef: `https://www.youtube.com/watch?v=${videoId}`,
    title,
    content: transcript,
    raw: transcript,
    rawExtension: 'txt',
    meta,
  };
}
