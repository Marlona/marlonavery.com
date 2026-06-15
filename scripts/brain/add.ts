#!/usr/bin/env npx tsx
/**
 * Content Brain — ingestion CLI.
 *
 * Usage:
 *   npm run brain:add -- <url|path>     Ingest a web page, YouTube video, or local doc
 *   npm run brain:add:dry -- <url|path> Preview ingestion without writing (DRY_RUN=true)
 *   npm run brain:list                  List current brain entries
 *
 * Environment (checked in order: process.env, .env, ~/.env):
 *   ANTHROPIC_API_KEY  - required for normalization
 *   BRAIN_MODEL        - optional normalizer model override (default claude-sonnet-4-6)
 *   DRY_RUN            - "true" to preview without writing
 *
 * The Brain lives in the gitignored brain/ directory; see docs/content-brain.md.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { loadEnv } from 'vite';
import { ingestWeb } from './lib/ingestors/web.js';
import { ingestYouTube } from './lib/ingestors/youtube.js';
import { ingestDoc } from './lib/ingestors/doc.js';
import { normalize } from './lib/normalizer.js';
import {
  readIndex,
  hasSource,
  makeEntryId,
  writeEntry,
  writeSource,
  appendToIndex,
} from './lib/index-manager.js';
import type {
  BrainEntry,
  BrainEntryFrontmatter,
  IndexRecord,
  RawCapture,
  SourceType,
} from './lib/types.js';

/** Parse a .env file into key-value pairs (mirrors scripts/generate-case-studies.ts). */
function parseEnvFile(filepath: string): Record<string, string> {
  if (!existsSync(filepath)) return {};
  try {
    const content = readFileSync(filepath, 'utf-8');
    const result: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        result[key] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function resolveEnv(name: string): string | undefined {
  const projectEnv = loadEnv('production', process.cwd(), '');
  const homeEnv = parseEnvFile(join(homedir(), '.env'));
  return process.env[name] || projectEnv[name] || homeEnv[name];
}

/** Decide which ingestor to use from the raw source argument. */
function detectSourceType(source: string): SourceType {
  if (/^https?:\/\//i.test(source)) {
    try {
      const host = new URL(source).hostname.replace(/^www\./, '');
      if (host === 'youtube.com' || host === 'youtu.be' || host.endsWith('.youtube.com')) {
        return 'youtube';
      }
    } catch {
      // fall through to web
    }
    return 'web';
  }
  return 'doc';
}

async function ingest(source: string, sourceType: SourceType): Promise<RawCapture> {
  switch (sourceType) {
    case 'web':
      return ingestWeb(source);
    case 'youtube':
      return ingestYouTube(source);
    case 'doc':
      return ingestDoc(source);
  }
}

function listBrain(): void {
  const index = readIndex();
  if (index.length === 0) {
    console.log('🧠 The Brain is empty. Add a source with: npm run brain:add -- <url|path>');
    return;
  }
  const unprocessed = index.filter((r) => !r.processed).length;
  console.log(`🧠 Brain: ${index.length} entr${index.length === 1 ? 'y' : 'ies'} (${unprocessed} unprocessed)\n`);
  for (const r of index) {
    const flag = r.processed ? '  ' : '🆕';
    const conf = r.confidentialityFlag ? ' 🔒' : '';
    const date = r.ingestedAt.split('T')[0];
    console.log(`${flag} [${r.sourceType}] ${r.title}${conf}`);
    console.log(`     ${date} · ${r.id}`);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    listBrain();
    return;
  }

  const source = args.find((a) => !a.startsWith('--'));
  if (!source) {
    console.error('❌ Usage: npm run brain:add -- <url|path>');
    process.exit(1);
  }

  const dryRun = process.env.DRY_RUN === 'true';
  const apiKey = resolveEnv('ANTHROPIC_API_KEY');
  const model = resolveEnv('BRAIN_MODEL');

  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not set (.env, ~/.env, or environment).');
    process.exit(1);
  }

  const sourceType = detectSourceType(source);
  console.log(`🧠 Adding ${sourceType} source: ${source}`);

  // Dedupe is keyed on the canonical sourceRef. For web/youtube the input URL is
  // close enough to short-circuit obvious repeats before fetching; the post-ingest
  // sourceRef (normalized) is the authoritative check.
  const index = readIndex();
  if (hasSource(source, index)) {
    console.log('⏭️  Already in the Brain (by source reference) — skipping.');
    return;
  }

  let capture: RawCapture;
  try {
    capture = await ingest(source, sourceType);
  } catch (error) {
    console.error(`❌ Ingestion failed: ${(error as Error).message}`);
    process.exit(1);
  }

  // Authoritative dedupe on the canonical reference produced by the ingestor.
  if (hasSource(capture.sourceRef, index)) {
    console.log('⏭️  Already in the Brain (canonical reference) — skipping.');
    return;
  }

  console.log(`   Extracted "${capture.title}" (${capture.content.length} chars). Normalizing…`);

  let fields;
  try {
    fields = await normalize(capture, { apiKey, model });
  } catch (error) {
    console.error(`❌ Normalization failed: ${(error as Error).message}`);
    process.exit(1);
  }

  const id = makeEntryId(capture.sourceType, capture.sourceRef);
  const frontmatter: BrainEntryFrontmatter = {
    id,
    sourceType: capture.sourceType,
    sourceRef: capture.sourceRef,
    title: capture.title,
    ingestedAt: new Date().toISOString(),
    summary: fields.summary,
    tags: fields.tags,
    topics: fields.topics,
    entities: fields.entities,
    keyFacts: fields.keyFacts,
    suggestedUse: fields.suggestedUse,
    confidentialityFlag: fields.confidentialityFlag,
    processed: false,
  };
  const entry: BrainEntry = { frontmatter, content: capture.content };
  const record: IndexRecord = {
    id,
    sourceType: frontmatter.sourceType,
    sourceRef: frontmatter.sourceRef,
    title: frontmatter.title,
    ingestedAt: frontmatter.ingestedAt,
    confidentialityFlag: frontmatter.confidentialityFlag,
    processed: false,
  };

  if (dryRun) {
    console.log('\n📋 DRY RUN — would write:');
    console.log(`   entry:  brain/entries/${id}.md`);
    console.log(`   source: brain/sources/${id}.${capture.rawExtension}`);
    console.log(`   summary: ${fields.summary}`);
    console.log(`   tags: ${fields.tags.join(', ') || '(none)'}`);
    console.log(`   key facts: ${fields.keyFacts.length} (${fields.keyFacts.filter((f) => f.kind === 'about-marlon').length} about Marlon)`);
    console.log(`   confidential: ${fields.confidentialityFlag}`);
    return;
  }

  writeSource(id, capture.raw, capture.rawExtension);
  const entryPath = writeEntry(entry);
  appendToIndex(record);

  console.log(`\n✅ Added to Brain: ${entryPath}`);
  if (frontmatter.confidentialityFlag) {
    console.log('   🔒 Flagged as potentially confidential — keep private.');
  }
  console.log('   Run /brain-review to generate site proposals from new entries.');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
