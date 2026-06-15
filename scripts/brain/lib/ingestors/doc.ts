/**
 * Local document ingestor: extracts text from md/txt (native), PDF (pdf-parse),
 * and Word .docx (mammoth). Other file types are rejected.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname, basename } from 'node:path';
// Import the library entrypoint directly to avoid pdf-parse's debug-on-import behavior.
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import type { RawCapture } from '../types.js';

const TEXT_EXTENSIONS = new Set(['.md', '.markdown', '.txt', '.text']);

/**
 * Ingest a local document into a RawCapture. `path` may be relative or absolute;
 * it is resolved to an absolute path for use as the canonical sourceRef.
 */
export async function ingestDoc(path: string): Promise<RawCapture> {
  const absPath = resolve(path);
  if (!existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const ext = extname(absPath).toLowerCase();
  const title = basename(absPath, ext);

  let content: string;
  let rawExtension: string;

  if (TEXT_EXTENSIONS.has(ext)) {
    content = readFileSync(absPath, 'utf-8');
    rawExtension = ext.replace('.', '') || 'txt';
  } else if (ext === '.pdf') {
    const buffer = readFileSync(absPath);
    const result = await pdfParse(buffer);
    content = result.text;
    rawExtension = 'txt';
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: absPath });
    content = result.value;
    rawExtension = 'txt';
  } else {
    throw new Error(
      `Unsupported document type "${ext}". Supported: .md, .txt, .pdf, .docx. ` +
        `(Local video/audio transcription is out of scope.)`
    );
  }

  content = content.trim();
  if (!content) {
    throw new Error(`No text could be extracted from ${absPath}`);
  }

  return {
    sourceType: 'doc',
    sourceRef: absPath,
    title,
    content,
    raw: content,
    rawExtension,
  };
}
