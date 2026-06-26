import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import type { RawCapture } from '../types.js';

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

export async function ingestWeb(url: string): Promise<RawCapture> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ContentBrain/1.0)' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.textContent?.trim()) {
    throw new Error(`No readable content found at ${url}`);
  }

  const markdown = turndown.turndown(article.content || article.textContent);

  return {
    sourceType: 'web',
    sourceRef: url,
    title: article.title || url,
    content: markdown,
    raw: html,
    rawExtension: 'html',
    meta: {
      ...(article.byline ? { byline: article.byline } : {}),
      ...(article.siteName ? { siteName: article.siteName } : {}),
    },
  };
}
