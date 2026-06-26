import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { BrainEntryFrontmatter, IndexRecord, NormalizedFields, RawCapture } from './types.js';

const BRAIN_DIR = join(process.cwd(), 'brain');
const ENTRIES_DIR = join(BRAIN_DIR, 'entries');
const SOURCES_DIR = join(BRAIN_DIR, 'sources');
const PROPOSALS_DIR = join(BRAIN_DIR, 'proposals');
const INDEX_PATH = join(BRAIN_DIR, 'index.json');

export function ensureDirs(): void {
  mkdirSync(ENTRIES_DIR, { recursive: true });
  mkdirSync(SOURCES_DIR, { recursive: true });
  mkdirSync(PROPOSALS_DIR, { recursive: true });
}

export function readIndex(): IndexRecord[] {
  if (!existsSync(INDEX_PATH)) return [];
  try {
    return JSON.parse(readFileSync(INDEX_PATH, 'utf-8')) as IndexRecord[];
  } catch {
    return [];
  }
}

function writeIndex(records: IndexRecord[]): void {
  writeFileSync(INDEX_PATH, JSON.stringify(records, null, 2), 'utf-8');
}

export function findBySourceRef(sourceRef: string): IndexRecord | undefined {
  return readIndex().find(r => r.sourceRef === sourceRef);
}

export function makeEntryId(capture: RawCapture): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const slug = capture.sourceRef
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .slice(0, 40)
    .replace(/^-|-$/g, '');
  return `${capture.sourceType}-${slug}-${date}`;
}

export function writeEntry(
  id: string,
  capture: RawCapture,
  normalized: NormalizedFields
): void {
  const fm: BrainEntryFrontmatter = {
    id,
    sourceType: capture.sourceType,
    ...(capture.docKind ? { docKind: capture.docKind } : {}),
    sourceRef: capture.sourceRef,
    title: capture.title,
    ingestedAt: new Date().toISOString(),
    summary: normalized.summary,
    tags: normalized.tags,
    topics: normalized.topics,
    entities: normalized.entities,
    keyFacts: normalized.keyFacts,
    suggestedUse: normalized.suggestedUse,
    confidentialityFlag: normalized.confidentialityFlag,
    processed: false,
  };

  const fileContent = matter.stringify(capture.content, fm as unknown as Record<string, unknown>);
  writeFileSync(join(ENTRIES_DIR, `${id}.md`), fileContent, 'utf-8');
}

export function writeSource(id: string, raw: string, extension: string): void {
  writeFileSync(join(SOURCES_DIR, `${id}.${extension}`), raw, 'utf-8');
}

export function appendToIndex(id: string, capture: RawCapture, normalized: NormalizedFields): void {
  const records = readIndex();
  const record: IndexRecord = {
    id,
    sourceType: capture.sourceType,
    ...(capture.docKind ? { docKind: capture.docKind } : {}),
    sourceRef: capture.sourceRef,
    title: capture.title,
    ingestedAt: new Date().toISOString(),
    confidentialityFlag: normalized.confidentialityFlag,
    processed: false,
  };
  records.push(record);
  writeIndex(records);
}

export function markProcessed(id: string): void {
  const records = readIndex();
  const record = records.find(r => r.id === id);
  if (record) {
    record.processed = true;
    writeIndex(records);
  }

  const entryPath = join(ENTRIES_DIR, `${id}.md`);
  if (existsSync(entryPath)) {
    const file = matter(readFileSync(entryPath, 'utf-8'));
    file.data.processed = true;
    writeFileSync(entryPath, matter.stringify(file.content, file.data), 'utf-8');
  }
}

export function getUnprocessed(): IndexRecord[] {
  return readIndex().filter(r => !r.processed);
}
