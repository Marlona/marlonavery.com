# Implementation Plan: Content Brain & Strategist Agent

**Branch**: `feat/content-brain-strategist` | **Date**: 2026-06-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-content-brain-strategist/spec.md`

## Summary

Build a local, gitignored **Content Brain** — a knowledge store that ingests web pages,
YouTube transcripts, and local docs (md/txt/pdf/docx), normalizes each into a structured
entry via Claude, and tracks them in a JSON manifest. Add a **Strategist** (a Claude Code
subagent + `/brain-review` skill) that reads unprocessed entries plus current site state and
writes propose-only recommendations (blog/copy/project/SEO/GEO) to `brain/proposals/`.
Approved proposals are promoted into their own specs, keeping every site change spec-gated.

Hybrid architecture: ingestion = TypeScript npm scripts (reusing the existing case-study
generator patterns); strategy = a Claude Code agent/skill. Local video/audio transcription is
out of scope for this version.

## Technical Context

**Language/Version**: TypeScript run via `tsx` (Node ≥ 18, matches existing `scripts/`). Claude
Code agent/skill authored in Markdown.

**Primary Dependencies**: `@anthropic-ai/sdk` + `gray-matter` (existing); `jsdom` +
`@mozilla/readability` + `turndown` (web extraction → markdown); `youtube-transcript` (captions);
`pdf-parse` + `mammoth` (PDF/docx). All added as devDependencies (installed).

**Storage**: Local filesystem under gitignored `brain/`: `entries/<id>.md` (gray-matter
frontmatter + body), `sources/<id>.<ext>` (raw provenance), `proposals/<date>-<slug>.md`,
`index.json` (manifest). No database or vector store at current scale.

**Models**: `claude-sonnet-4-6` for normalization (fast/cheap extraction);
`claude-opus-4-8` for the Strategist (deep reasoning). Both overridable via env. Confirm exact
ids/params against the `claude-api` skill at implementation time.

**Testing**: Manual `quickstart.md` validation (ingest a URL/YouTube/doc; run `/brain-review`);
`npm run typecheck` (astro check) for build health. `node --test` available but no unit tests
required by spec.

**Target Platform**: Local developer machine (macOS/Node). This is authoring/build tooling, not
runtime site code — it never ships to the deployed static site.

**Project Type**: Build-time CLI tooling + Claude Code agent/skill for an Astro static site.

**Performance Goals**: Single-source ingest completes in seconds + one Claude call; 1s rate-limit
between calls (matches case-study generator). No throughput targets.

**Constraints**: Propose-only (no site edits by the Strategist); `brain/` never committed; no
fabrication; employer confidentiality.

**Scale/Scope**: Single user (Marlon), local. Tens-to-hundreds of entries.

## Constitution Check

*GATE: must pass before Phase 0 and after Phase 1 design.*

| Principle | Assessment |
|-----------|------------|
| **I. Specs Are the Source of Truth** | PASS. Feature has spec 002. The Strategist is propose-only; proposals must be promoted via `/speckit-specify` before any site change — reinforces, not bypasses, the workflow. |
| **II. Marlon Avery Identity Is Canonical** | PASS. Feature adds no user-facing site content. Brain content is private. Proposals that touch identity inherit the spec workflow's identity gate. |
| **III. Claims Must Be Verified** | PASS. Normalizer separates `about-marlon` facts (need verification) from `general`. Strategist must mark unverified claims `[NEEDS CLARIFICATION]` and never fabricate. Confidentiality flag on entries. |
| **IV. Content Contracts Come First** | PASS. Proposals target the existing `src/content/config.ts` schemas and `src/config.ts`; this feature changes no schemas. Brain entry/proposal formats are documented in `contracts/`. |
| **V. Verification Is Part of the Work** | PASS. `quickstart.md` defines runnable checks (ingest, dedupe, gitignore, propose-only invariant, typecheck). |

**Result**: No violations. No entries required in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-content-brain-strategist/
├── spec.md              # complete
├── plan.md              # this file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (cli.md, formats.md)
└── tasks.md             # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
scripts/brain/
├── add.ts                       # CLI entry: detect type → ingest → normalize → write
├── lib/
│   ├── types.ts                 # DONE — shared types
│   ├── index-manager.ts         # DONE — brain/ dirs, index.json, dedupe, write entry/source
│   ├── normalizer.ts            # Claude call: RawCapture → NormalizedFields
│   └── ingestors/
│       ├── web.ts               # DONE — URL → readable markdown
│       ├── youtube.ts           # video URL → transcript + metadata
│       └── doc.ts               # local md/txt/pdf/docx → text
└── prompts/
    └── normalize.md             # normalization prompt (no fabrication; flag confidential)

.claude/agents/content-strategist.md      # Strategist subagent (SEO/GEO/positioning, guardrails)
.claude/skills/brain-review/SKILL.md       # /brain-review loop (read entries + site state → proposals)

docs/content-brain.md                      # committed docs for the gitignored brain
```

**Structure Decision**: Extend the proven `scripts/lib/` modular pattern under `scripts/brain/`.
Ingestion is deterministic TS tooling; the Strategist is a Claude Code agent/skill so it can use
live tools (Read/Grep/WebFetch) and rich reasoning. `brain/` (data) is gitignored; `scripts/brain/`
(code) is tracked — note the root-anchored `/brain/` gitignore rule prevents matching the code dir.

## Complexity Tracking

No constitution violations — table omitted.
