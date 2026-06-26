import { readFileSync, existsSync } from 'node:fs';
import { extname, basename, resolve } from 'node:path';
import type { DocKind, RawCapture } from '../types.js';

const SUPPORTED_EXTENSIONS = new Set(['.md', '.txt', '.pdf', '.docx']);

function detectDocKind(filePath: string, kindOverride?: string): DocKind {
  if (kindOverride) {
    if (kindOverride === 'podcast-transcript') return 'podcast-transcript';
    if (kindOverride === 'resume') return 'resume';
    return 'general';
  }
  const lower = basename(filePath).toLowerCase();
  if (lower.includes('transcript') || lower.includes('podcast') || lower.includes('episode')) {
    return 'podcast-transcript';
  }
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('curriculum')) {
    return 'resume';
  }
  return 'general';
}

async function extractText(filePath: string, ext: string): Promise<string> {
  if (ext === '.md' || ext === '.txt') {
    return readFileSync(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    // pdf-parse must be imported via its lib path to avoid test-file side effects
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    const buffer = readFileSync(filePath);
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (ext === '.docx') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

export async function ingestDoc(
  filePath: string,
  kindOverride?: string
): Promise<RawCapture> {
  const absPath = resolve(filePath);

  if (!existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const ext = extname(absPath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new Error(
      `Unsupported file type "${ext}". Supported: ${[...SUPPORTED_EXTENSIONS].join(', ')}`
    );
  }

  const text = await extractText(absPath, ext);

  if (!text.trim()) {
    throw new Error(`No text content extracted from ${absPath}`);
  }

  const docKind = detectDocKind(absPath, kindOverride);
  const title = basename(absPath, ext).replace(/[-_]/g, ' ');

  return {
    sourceType: 'doc',
    sourceRef: absPath,
    title,
    content: text,
    raw: text,
    rawExtension: ext.slice(1),
    docKind,
  };
}
