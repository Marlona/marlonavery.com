/**
 * Shared TypeScript types for the Content Brain ingestion pipeline.
 *
 * The Brain is a gitignored knowledge store. Raw source material is captured by
 * an ingestor, normalized by Claude into a structured entry, and tracked in an
 * index manifest. The Strategist agent (Claude Code) reads entries and proposes
 * site changes — see docs/content-brain.md.
 */

/**
 * Where a piece of knowledge came from.
 * - 'web':     an arbitrary web page
 * - 'youtube': a YouTube video (transcript + metadata)
 * - 'doc':     a local file (md, txt, pdf, docx)
 */
export type SourceType = 'web' | 'youtube' | 'doc';

/**
 * Raw material captured by an ingestor, before normalization.
 * `content` is the best-effort plain-text/markdown extraction of the source.
 */
export interface RawCapture {
  sourceType: SourceType;
  /** Canonical reference used for dedupe: a URL, or an absolute file path. */
  sourceRef: string;
  /** Best-available human title for the source. */
  title: string;
  /** Extracted text/markdown body. */
  content: string;
  /** Original captured bytes (html/transcript/text) persisted for provenance. */
  raw: string;
  /** File extension to use when persisting `raw` under brain/sources/. */
  rawExtension: string;
  /** Optional source metadata (author, channel, publish date, etc.). */
  meta?: Record<string, string>;
}

/**
 * A single fact extracted from a source. Claims about Marlon must be verified
 * before they can appear on the site; general knowledge does not.
 */
export interface KeyFact {
  statement: string;
  /** 'about-marlon' facts require human verification; 'general' facts do not. */
  kind: 'about-marlon' | 'general';
}

/**
 * The normalized, structured knowledge produced by the Claude normalizer.
 * Persisted as gray-matter frontmatter on the entry file.
 */
export interface BrainEntryFrontmatter {
  id: string;
  sourceType: SourceType;
  sourceRef: string;
  title: string;
  ingestedAt: string;
  /** 1-3 sentence neutral summary of the source. */
  summary: string;
  tags: string[];
  topics: string[];
  entities: string[];
  keyFacts: KeyFact[];
  /** Where this might be useful on the site, e.g. "blog-seed", "about-proof". */
  suggestedUse: string[];
  /** True if the source appears to contain employer-sensitive material. */
  confidentialityFlag: boolean;
  /** True once the Strategist has reviewed this entry. */
  processed: boolean;
}

/**
 * A complete brain entry: structured frontmatter + cleaned markdown body.
 */
export interface BrainEntry {
  frontmatter: BrainEntryFrontmatter;
  /** The cleaned source content (markdown). */
  content: string;
}

/**
 * The subset of normalized fields Claude is asked to produce. The pipeline
 * supplies id/sourceType/sourceRef/title/ingestedAt/processed.
 */
export interface NormalizedFields {
  summary: string;
  tags: string[];
  topics: string[];
  entities: string[];
  keyFacts: KeyFact[];
  suggestedUse: string[];
  confidentialityFlag: boolean;
}

/**
 * One line per entry in brain/index.json, used for dedupe and processed-state
 * tracking without parsing every entry file.
 */
export interface IndexRecord {
  id: string;
  sourceType: SourceType;
  sourceRef: string;
  title: string;
  ingestedAt: string;
  confidentialityFlag: boolean;
  processed: boolean;
}

/**
 * Configuration for the normalizer Claude call.
 */
export interface NormalizerConfig {
  apiKey: string;
  model?: string;
  systemPrompt?: string;
}
