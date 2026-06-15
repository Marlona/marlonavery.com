# Content Brain & Strategist

The Content Brain is a **private, gitignored** knowledge store for the Marlon Avery site, plus a
**Strategist** agent that turns that knowledge into propose-only site-improvement suggestions.

- Spec: `specs/002-content-brain-strategist/spec.md`
- Plan & contracts: `specs/002-content-brain-strategist/plan.md`, `.../contracts/`

## Why it's gitignored

`brain/` may hold raw scraped pages, video transcripts, personal notes, and unverified or
employer-sensitive material. This repo is **public**, so the entire `brain/` directory is excluded
from version control (root-anchored `/brain/` rule in `.gitignore`). Only approved content ever
reaches the site, and only via the spec-driven workflow.

> The `.gitignore` rule is `/brain/` (leading slash) so it matches the top-level knowledge store
> but **not** `scripts/brain/` (the ingestion code, which is tracked).

## Directory layout

```
brain/                     # gitignored
├── entries/<id>.md        # normalized knowledge: gray-matter frontmatter + cleaned body
├── sources/<id>.<ext>     # raw captured material (provenance)
├── proposals/<date>-<slug>.md   # Strategist output (review these)
└── index.json             # manifest: dedupe + processed-state tracking
```

Entry/index/proposal formats are defined in `specs/002-content-brain-strategist/contracts/formats.md`.

## The loop

```
npm run brain:add -- <source>   →   /brain-review   →   review proposals   →   /speckit-specify   →   plan → implement
       (ingest)                      (Strategist)        (you decide)          (promote a proposal)
```

### 1. Add sources (ingestion)

```bash
npm run brain:add -- https://example.com/some-article   # web page
npm run brain:add -- https://youtu.be/VIDEO_ID           # YouTube (uses transcript)
npm run brain:add -- ./notes/talk-outline.md             # local md/txt/pdf/docx
npm run brain:add:dry -- <source>                        # preview, write nothing
npm run brain:list                                       # list the brain
```

Each source is fetched, normalized by Claude into a structured entry (summary, tags, topics,
entities, key facts, suggested uses, confidentiality flag), and stored with its raw capture.
Duplicate sources are skipped. Requires `ANTHROPIC_API_KEY` (see `.env.example`).

Key facts are split into **`about-marlon`** (claims about Marlon — must be verified before any
site use) and **`general`** (background knowledge).

### 2. Review (Strategist)

In Claude Code:

```
/brain-review
```

The `brain-review` skill loads unprocessed entries plus the current site state and uses the
`content-strategist` subagent (deep SEO / GEO / web-structure / thought-leadership expertise) to
write proposals to `brain/proposals/`. It then marks the reviewed entries `processed: true`.

**The Strategist is propose-only.** It never edits site content. Every proposal cites the Brain
entries it draws from, marks unverified claims with `[NEEDS CLARIFICATION]`, and respects employer
confidentiality.

### 3. Promote a proposal (spec-driven change)

Read the proposals in `brain/proposals/`. For any you want to pursue:

```
/speckit-specify <summary of the proposal>
```

This creates a normal feature spec that goes through plan → tasks → implement with the usual
accuracy, confidentiality, and verification gates. Promotion leaves the Brain unchanged; rejected
or deferred proposals simply stay in `brain/proposals/` for later.

## Guardrails (from the constitution)

- **No fabrication** — unverified claims are marked `[NEEDS CLARIFICATION]`, never asserted.
- **Employer confidentiality** — `brain/` is gitignored; sensitive entries are flagged; proposals
  never expose confidential specifics.
- **Propose-only** — all real site changes flow through the spec-driven workflow.

## Code map

- `scripts/brain/add.ts` — ingestion CLI (detect type → ingest → normalize → write)
- `scripts/brain/lib/ingestors/{web,youtube,doc}.ts` — source ingestors
- `scripts/brain/lib/normalizer.ts` + `scripts/brain/prompts/normalize.md` — Claude normalization
- `scripts/brain/lib/index-manager.ts` — brain store, manifest, dedupe, `markProcessed`
- `.claude/agents/content-strategist.md` — the Strategist subagent
- `.claude/skills/brain-review/SKILL.md` — the `/brain-review` loop

> Note: the agent and skill live under `.claude/`, which this repo gitignores by default. They are
> active locally. To version them, add `.gitignore` negations for those two paths.

## Out of scope (later phases)

Local video/audio transcription, automatic Strategist runs on ingest, and vector search over the
Brain.
