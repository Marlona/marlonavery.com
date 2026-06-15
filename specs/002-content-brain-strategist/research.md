# Phase 0 Research: Content Brain & Strategist Agent

No `NEEDS CLARIFICATION` markers remained in the spec or Technical Context. Research below
records the key technology decisions and their rationale.

## Decision 1: Hybrid architecture (scripts for ingestion, Claude Code agent/skill for strategy)

- **Decision**: Ingestion is deterministic TypeScript run via `tsx` npm scripts; the Strategist is
  a Claude Code subagent + `/brain-review` skill.
- **Rationale**: Ingestion (fetch, parse, normalize, dedupe, write) is repeatable I/O best done as
  scripts, reusing the proven `scripts/lib/` case-study pattern. Strategy needs live tool access
  (read the site, grep, fetch) and deep reasoning, which a Claude Code agent provides natively.
- **Alternatives**: Pure script pipeline (weaker, no live tools for strategy); pure Claude Code
  agent (no repeatable bulk ingestion, weak for YouTube/docs). Chosen per approved design.

## Decision 2: Web extraction via jsdom + @mozilla/readability + turndown

- **Decision**: Fetch HTML, extract main content with Readability, convert to markdown with Turndown.
- **Rationale**: Readability is the battle-tested article-extraction engine (Firefox Reader View);
  Turndown is the standard HTML→markdown converter. Keeps the normalizer's token cost low by
  sending cleaned content, not raw HTML.
- **Alternatives**: Send raw HTML to Claude (expensive, noisy); headless browser/Playwright
  (heavyweight, unnecessary for static article content).

## Decision 3: YouTube transcripts via youtube-transcript + oEmbed

- **Decision**: Use `youtube-transcript` for captions (no API key) and YouTube oEmbed for title.
- **Rationale**: No Google API key or quota needed; works for any video with captions. oEmbed gives
  a reliable title without scraping.
- **Alternatives**: YouTube Data API (needs key/quota); yt-dlp (external binary). Transcript-less
  videos are an accepted failure mode (reported, no entry) per spec edge cases.

## Decision 4: Local docs via pdf-parse + mammoth; md/txt native

- **Decision**: `pdf-parse` for PDF text, `mammoth` for `.docx` → text/markdown, native `fs` for
  md/txt.
- **Rationale**: Both are small, widely used, dependency-light. Covers the spec's required formats.
- **Alternatives**: Office/cloud parsers (overkill). Images and audio/video are explicitly rejected
  (local transcription deferred).
- **Note**: import `pdf-parse` via its library entrypoint (`pdf-parse/lib/pdf-parse.js`) to avoid
  the package's debug-on-import behavior.

## Decision 5: Models — Sonnet for normalization, Opus for strategy

- **Decision**: `claude-sonnet-4-6` normalizes (extraction/summarization); `claude-opus-4-8` powers
  the Strategist. Both overridable via env.
- **Rationale**: Normalization is high-volume, low-creativity → Sonnet is fast and cheap. Strategy
  is low-volume, high-judgment (SEO/GEO/positioning) → Opus. Mirrors the existing generator's
  env-overridable model pattern.
- **Alternatives**: One model for both (worse cost/quality tradeoff).

## Decision 6: Storage — flat files + JSON index, gitignored

- **Decision**: `brain/entries/*.md` (gray-matter), `brain/sources/*`, `brain/proposals/*.md`,
  `brain/index.json`. Whole `brain/` is gitignored (root-anchored `/brain/`).
- **Rationale**: Matches the repo's gray-matter content convention; human-inspectable; no infra.
  Gitignoring protects confidential/unapproved material in a public repo. Vector search is
  unnecessary at this scale (out of scope).
- **Alternatives**: SQLite/vector DB (premature). Committing the brain (confidentiality risk).

## Decision 7: Dedupe by canonical source reference

- **Decision**: `index.json` records `sourceRef` (URL or absolute path); re-adds are skipped.
- **Rationale**: Cheap, deterministic, no entry-file scanning. Mirrors the case-study
  `hasExistingCaseStudy` dedupe approach.
- **Alternatives**: Content-hash dedupe (handles re-fetches of changed pages, but adds complexity);
  deferred.
