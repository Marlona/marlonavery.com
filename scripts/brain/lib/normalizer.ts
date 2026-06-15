/**
 * Normalizes a RawCapture into structured knowledge fields using Claude.
 * Mirrors the Anthropic client + prompt-file loading pattern from
 * scripts/lib/claude-generator.ts.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  KeyFact,
  NormalizedFields,
  NormalizerConfig,
  RawCapture,
} from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_PROMPT = join(__dirname, '../prompts/normalize.md');
const DEFAULT_MODEL = 'claude-sonnet-4-6';

/** Cap how much source content we send, to bound token cost on huge sources. */
const MAX_CONTENT_CHARS = 48_000;

function loadPromptTemplate(path: string): string {
  if (!existsSync(path)) {
    throw new Error(`Normalizer prompt not found: ${path}`);
  }
  return readFileSync(path, 'utf-8');
}

function buildPrompt(capture: RawCapture): { prompt: string; truncated: boolean } {
  const template = loadPromptTemplate(DEFAULT_PROMPT);
  const truncated = capture.content.length > MAX_CONTENT_CHARS;
  const content = truncated
    ? capture.content.slice(0, MAX_CONTENT_CHARS) +
      '\n\n[...content truncated for length...]'
    : capture.content;

  const substitutions: Record<string, string> = {
    '{{sourceType}}': capture.sourceType,
    '{{sourceRef}}': capture.sourceRef,
    '{{title}}': capture.title,
    '{{content}}': content,
  };

  let prompt = template;
  for (const [key, value] of Object.entries(substitutions)) {
    prompt = prompt.replaceAll(key, value);
  }
  return { prompt, truncated };
}

/**
 * Pull the first JSON object out of a model response, tolerating stray prose or
 * markdown code fences around it.
 */
function extractJson(text: string): unknown {
  let cleaned = text.trim();
  // Strip code fences if present.
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }
  // Fall back to the outermost braces.
  if (!cleaned.startsWith('{')) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Normalizer response contained no JSON object');
    }
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned);
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v)).filter((s) => s.trim().length > 0);
}

function asKeyFacts(value: unknown): KeyFact[] {
  if (!Array.isArray(value)) return [];
  const facts: KeyFact[] = [];
  for (const item of value) {
    if (item && typeof item === 'object' && 'statement' in item) {
      const statement = String((item as Record<string, unknown>).statement).trim();
      if (!statement) continue;
      const rawKind = String((item as Record<string, unknown>).kind ?? 'general');
      const kind: KeyFact['kind'] = rawKind === 'about-marlon' ? 'about-marlon' : 'general';
      facts.push({ statement, kind });
    }
  }
  return facts;
}

/**
 * Run the normalizer Claude call and return validated NormalizedFields.
 */
export async function normalize(
  capture: RawCapture,
  config: NormalizerConfig
): Promise<NormalizedFields> {
  const client = new Anthropic({ apiKey: config.apiKey });
  const { prompt } = buildPrompt(capture);

  const message = await client.messages.create({
    model: config.model || DEFAULT_MODEL,
    max_tokens: 2048,
    ...(config.systemPrompt ? { system: config.systemPrompt } : {}),
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in normalizer response');
  }

  const parsed = extractJson(textBlock.text) as Record<string, unknown>;

  return {
    summary: String(parsed.summary ?? '').trim(),
    tags: asStringArray(parsed.tags),
    topics: asStringArray(parsed.topics),
    entities: asStringArray(parsed.entities),
    keyFacts: asKeyFacts(parsed.keyFacts),
    suggestedUse: asStringArray(parsed.suggestedUse),
    confidentialityFlag: parsed.confidentialityFlag === true,
  };
}
