/**
 * Manages the Content Brain's on-disk state: the index manifest, entry files,
 * and raw source captures. Mirrors the gray-matter read/write + dedupe pattern
 * used by scripts/lib/mdx-manager.ts.
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { BrainEntry, IndexRecord } from './types.js';

/** Root of the gitignored brain store, relative to repo root (process.cwd()). */
export const BRAIN_DIR = 'brain';
export const ENTRIES_DIR = join(BRAIN_DIR, 'entries');
export const SOURCES_DIR = join(BRAIN_DIR, 'sources');
export const PROPOSALS_DIR = join(BRAIN_DIR, 'proposals');
export const INDEX_PATH = join(BRAIN_DIR, 'index.json');

/**
 * Ensure the brain directory skeleton exists.
 */
export function ensureBrainDirs(): void {
  for (const dir of [BRAIN_DIR, ENTRIES_DIR, SOURCES_DIR, PROPOSALS_DIR]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Read the index manifest. Returns an empty list if it does not exist yet.
 */
export function readIndex(): IndexRecord[] {
  if (!existsSync(INDEX_PATH)) {
    return [];
  }
  try {
    const raw = readFileSync(INDEX_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as IndexRecord[]) : [];
  } catch (error) {
    console.warn('Warning: could not parse brain/index.json, treating as empty:', error);
    return [];
  }
}

/**
 * Write the index manifest back to disk (pretty-printed for diff-friendliness).
 */
export function writeIndex(records: IndexRecord[]): void {
  ensureBrainDirs();
  writeFileSync(INDEX_PATH, JSON.stringify(records, null, 2) + '\n', 'utf-8');
}

/**
 * Has a source already been ingested? Dedupe is by normalized sourceRef.
 */
export function hasSource(sourceRef: string, index?: IndexRecord[]): boolean {
  const records = index ?? readIndex();
  return records.some((r) => r.sourceRef === sourceRef);
}

/**
 * Generate a filesystem-safe id from a source reference and timestamp.
 * Example: "youtube-dQw4w9WgXcQ-20260615" or "web-marlonavery-com-about-20260615".
 */
export function makeEntryId(sourceType: string, sourceRef: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const slugBase = sourceRef
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
  return `${sourceType}-${slugBase}-${date}`;
}

/**
 * Persist a raw source capture under brain/sources/ for provenance.
 */
export function writeSource(id: string, raw: string, extension: string): string {
  ensureBrainDirs();
  const path = join(SOURCES_DIR, `${id}.${extension}`);
  writeFileSync(path, raw, 'utf-8');
  return path;
}

/**
 * Write a normalized brain entry as an MDX-style file (frontmatter + body),
 * using gray-matter for consistent YAML formatting.
 */
export function writeEntry(entry: BrainEntry): string {
  ensureBrainDirs();
  const path = join(ENTRIES_DIR, `${entry.frontmatter.id}.md`);
  const file = matter.stringify(entry.content, entry.frontmatter);
  writeFileSync(path, file, 'utf-8');
  return path;
}

/**
 * Append a new entry to the index manifest and persist it.
 */
export function appendToIndex(record: IndexRecord): void {
  const records = readIndex();
  records.push(record);
  writeIndex(records);
}
