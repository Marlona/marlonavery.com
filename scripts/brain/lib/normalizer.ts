import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NormalizedFields, NormalizerConfig, RawCapture } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPT_PATH = join(__dirname, '../prompts/normalize.md');
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const MAX_CONTENT_CHARS = 60_000;

function buildPrompt(capture: RawCapture): string {
  const template = readFileSync(PROMPT_PATH, 'utf-8');
  const content =
    capture.content.length > MAX_CONTENT_CHARS
      ? capture.content.slice(0, MAX_CONTENT_CHARS) + '\n\n[Content truncated for normalization]'
      : capture.content;

  return template
    .replace('{{sourceType}}', capture.sourceType)
    .replace('{{docKind}}', capture.docKind ?? 'n/a')
    .replace('{{title}}', capture.title)
    .replace('{{sourceRef}}', capture.sourceRef)
    .replace('{{content}}', content);
}

function parseResponse(text: string): NormalizedFields {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Normalizer returned invalid JSON:\n${text.slice(0, 500)}`);
  }

  const p = parsed as Record<string, unknown>;

  return {
    summary: String(p.summary ?? ''),
    tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
    topics: Array.isArray(p.topics) ? p.topics.map(String) : [],
    entities: Array.isArray(p.entities) ? p.entities.map(String) : [],
    keyFacts: Array.isArray(p.keyFacts)
      ? p.keyFacts.map((f: unknown) => {
          const fact = f as Record<string, unknown>;
          return {
            statement: String(fact.statement ?? ''),
            kind: fact.kind === 'about-marlon' ? 'about-marlon' : 'general',
          };
        })
      : [],
    suggestedUse: Array.isArray(p.suggestedUse) ? p.suggestedUse.map(String) : [],
    confidentialityFlag: Boolean(p.confidentialityFlag),
  };
}

export async function normalize(
  capture: RawCapture,
  config: NormalizerConfig
): Promise<NormalizedFields> {
  if (config.dryRun) {
    return {
      summary: '[DRY RUN — normalization skipped]',
      tags: [],
      topics: [],
      entities: [],
      keyFacts: [],
      suggestedUse: [],
      confidentialityFlag: false,
    };
  }

  const client = new Anthropic({ apiKey: config.apiKey });
  const prompt = buildPrompt(capture);

  const message = await client.messages.create({
    model: config.model || DEFAULT_MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = message.content.find(b => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in normalizer response');
  }

  return parseResponse(textBlock.text);
}
