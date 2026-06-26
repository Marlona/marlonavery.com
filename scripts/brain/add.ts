#!/usr/bin/env npx tsx
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { loadEnv } from 'vite';
import {
  ensureDirs,
  findBySourceRef,
  makeEntryId,
  writeEntry,
  writeSource,
  appendToIndex,
  readIndex,
} from './lib/index-manager.js';
import { normalize } from './lib/normalizer.js';
import { ingestWeb } from './lib/ingestors/web.js';
import { ingestYouTube } from './lib/ingestors/youtube.js';
import { ingestDoc } from './lib/ingestors/doc.js';
import type { RawCapture } from './lib/types.js';

function parseEnvFile(filepath: string): Record<string, string> {
  if (!existsSync(filepath)) return {};
  try {
    const result: Record<string, string> = {};
    for (const line of readFileSync(filepath, 'utf-8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        result[match[1].trim()] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function loadApiKey(): string {
  const projectEnv = loadEnv('production', process.cwd(), '');
  const parentEnv = parseEnvFile(join(process.cwd(), '..', '.env'));
  const homeEnv = parseEnvFile(join(homedir(), '.env'));
  const key = process.env.ANTHROPIC_API_KEY || projectEnv.ANTHROPIC_API_KEY || parentEnv.ANTHROPIC_API_KEY || homeEnv.ANTHROPIC_API_KEY;
  if (!key) {
    console.error('Error: ANTHROPIC_API_KEY is required. Set it in .env, ~/.env, or the environment.');
    process.exit(1);
  }
  return key;
}

function detectSourceType(source: string): 'web' | 'youtube' | 'doc' {
  if (/^https?:\/\//i.test(source)) {
    if (/youtube\.com|youtu\.be/i.test(source)) return 'youtube';
    return 'web';
  }
  return 'doc';
}

function listBrain(): void {
  const records = readIndex();
  if (records.length === 0) {
    console.log('The Brain is empty. Add a source with: npm run brain:add -- <url|path>');
    return;
  }
  const unprocessed = records.filter(r => !r.processed);
  console.log(`\nContent Brain — ${records.length} entries (${unprocessed.length} unprocessed)\n`);
  console.log('  ID                                           TYPE       PROCESSED  TITLE');
  console.log('  ' + '─'.repeat(80));
  for (const r of records) {
    const type = (r.docKind ? `${r.sourceType}/${r.docKind}` : r.sourceType).padEnd(20);
    const processed = r.processed ? '✓        ' : '· review ';
    const title = r.title.slice(0, 40);
    const shortId = r.id.slice(0, 44).padEnd(44);
    console.log(`  ${shortId} ${type.slice(0, 10).padEnd(10)} ${processed}  ${title}`);
  }
  console.log();
  if (unprocessed.length > 0) {
    console.log(`  ${unprocessed.length} unprocessed — run /brain-review to generate proposals.`);
  }
}

async function ingest(source: string, kindOverride?: string): Promise<void> {
  const dryRun = process.env.DRY_RUN === 'true';
  const apiKey = loadApiKey();
  const model = process.env.BRAIN_MODEL;

  ensureDirs();

  const sourceType = detectSourceType(source);

  let capture: RawCapture;
  console.log(`\nIngesting ${sourceType}: ${source}`);

  try {
    if (sourceType === 'web') {
      capture = await ingestWeb(source);
    } else if (sourceType === 'youtube') {
      capture = await ingestYouTube(source);
    } else {
      capture = await ingestDoc(source, kindOverride);
    }
  } catch (err) {
    console.error(`\nFetch/parse error: ${String(err)}`);
    process.exit(1);
  }

  const existing = findBySourceRef(capture.sourceRef);
  if (existing) {
    console.log(`\nAlready in Brain (skipping): ${existing.id}`);
    console.log(`  Title: ${existing.title}`);
    process.exit(0);
  }

  console.log(`  Title: ${capture.title}`);
  console.log(`  Normalizing via Claude${dryRun ? ' [DRY RUN]' : ''}...`);

  let normalized;
  try {
    normalized = await normalize(capture, { apiKey, model, dryRun });
  } catch (err) {
    console.error(`\nNormalization error: ${String(err)}`);
    process.exit(1);
  }

  const id = makeEntryId(capture);

  if (dryRun) {
    console.log('\n[DRY RUN] Would write:');
    console.log(`  brain/entries/${id}.md`);
    console.log(`  brain/sources/${id}.${capture.rawExtension}`);
    console.log(`  brain/index.json (append)`);
    console.log(`\n  Summary: ${normalized.summary}`);
    console.log(`  Tags: ${normalized.tags.join(', ')}`);
    return;
  }

  writeEntry(id, capture, normalized);
  writeSource(id, capture.raw, capture.rawExtension);
  appendToIndex(id, capture, normalized);

  console.log(`\n✓ Added to Brain: ${id}`);
  console.log(`  Title: ${capture.title}`);
  if (normalized.confidentialityFlag) {
    console.log(`  ⚠ Confidentiality flag set — review before using in proposals`);
  }
  console.log('\n  Run /brain-review to generate proposals.');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--list') || args.length === 0) {
    listBrain();
    return;
  }

  const kindIndex = args.indexOf('--kind');
  let kindOverride: string | undefined;
  let filteredArgs = args;
  if (kindIndex !== -1) {
    kindOverride = args[kindIndex + 1];
    filteredArgs = args.filter((_, i) => i !== kindIndex && i !== kindIndex + 1);
  }

  const source = filteredArgs[0];
  if (!source) {
    console.error('Usage: npm run brain:add -- <url|path> [--kind podcast-transcript|resume|general]');
    process.exit(1);
  }

  await ingest(source, kindOverride);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
