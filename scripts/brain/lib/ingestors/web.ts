/**
 * Web page ingestor: fetches a URL, extracts the main readable content with
 * Mozilla Readability, and converts it to markdown with Turndown.
 */

import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import type { RawCapture } from '../types.js';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

/**
 * Fetch and extract a web page into a RawCapture.
 */
export async function ingestWeb(url: string): Promise<RawCapture> {
  const response = await fetch(url, {
    headers: {
      // A real UA avoids trivial bot-blocking on many sites.
      'User-Agent':
        'Mozilla/5.0 (compatible; MarlonAveryBrain/1.0; +https://marlonavery.com)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const title =
    article?.title ||
    dom.window.document.title ||
    url;

  // Prefer Readability's cleaned article HTML; fall back to the body.
  const contentHtml =
    article?.content || dom.window.document.body?.innerHTML || '';
  const markdown = turndown.turndown(contentHtml).trim();

  if (!markdown) {
    throw new Error(`No readable content extracted from ${url}`);
  }

  const meta: Record<string, string> = {};
  if (article?.byline) meta.byline = article.byline;
  if (article?.siteName) meta.siteName = article.siteName;
  if (article?.excerpt) meta.excerpt = article.excerpt;

  return {
    sourceType: 'web',
    sourceRef: url,
    title: title.trim(),
    content: markdown,
    raw: html,
    rawExtension: 'html',
    meta,
  };
}
