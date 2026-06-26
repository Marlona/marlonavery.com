export type SourceType = 'web' | 'youtube' | 'doc';
export type DocKind = 'podcast-transcript' | 'resume' | 'general';

export interface RawCapture {
  sourceType: SourceType;
  sourceRef: string;
  title: string;
  content: string;
  raw: string;
  rawExtension: string;
  docKind?: DocKind;
  meta?: Record<string, string>;
}

export interface KeyFact {
  statement: string;
  kind: 'about-marlon' | 'general';
}

export interface NormalizedFields {
  summary: string;
  tags: string[];
  topics: string[];
  entities: string[];
  keyFacts: KeyFact[];
  suggestedUse: string[];
  confidentialityFlag: boolean;
}

export interface BrainEntryFrontmatter {
  id: string;
  sourceType: SourceType;
  docKind?: DocKind;
  sourceRef: string;
  title: string;
  ingestedAt: string;
  summary: string;
  tags: string[];
  topics: string[];
  entities: string[];
  keyFacts: KeyFact[];
  suggestedUse: string[];
  confidentialityFlag: boolean;
  processed: boolean;
}

export interface IndexRecord {
  id: string;
  sourceType: SourceType;
  docKind?: DocKind;
  sourceRef: string;
  title: string;
  ingestedAt: string;
  confidentialityFlag: boolean;
  processed: boolean;
}

export interface NormalizerConfig {
  apiKey: string;
  model?: string;
  dryRun?: boolean;
}
