# Phase 1 Data Model: Content Brain & Strategist Agent

All persisted under the gitignored `brain/` directory. Types are defined in
`scripts/brain/lib/types.ts` (already implemented).

## RawCapture (transient)

Produced by an ingestor before normalization. Not persisted as-is except `raw` → `brain/sources/`.

| Field | Type | Notes |
|-------|------|-------|
| `sourceType` | `'web' \| 'youtube' \| 'doc'` | Detected from input. |
| `sourceRef` | string | Canonical dedupe key: URL or absolute file path. |
| `title` | string | Best-available human title. |
| `content` | string | Extracted text/markdown body. |
| `raw` | string | Original captured bytes (html/transcript/text) for provenance. |
| `rawExtension` | string | Extension used when persisting `raw`. |
| `meta` | `Record<string,string>?` | byline, siteName, channel, etc. |

## BrainEntry → `brain/entries/<id>.md` (gray-matter: frontmatter + body)

**Frontmatter** (`BrainEntryFrontmatter`):

| Field | Type | Validation |
|-------|------|------------|
| `id` | string | `<sourceType>-<slug>-<YYYYMMDD>`, filesystem-safe, unique. |
| `sourceType` | `'web'\|'youtube'\|'doc'` | required |
| `sourceRef` | string | required; dedupe key |
| `title` | string | required, non-empty |
| `ingestedAt` | ISO datetime | required |
| `summary` | string | 1–3 sentences, neutral; produced by normalizer |
| `tags` | string[] | lowercase topical labels |
| `topics` | string[] | broader themes |
| `entities` | string[] | people/orgs/products/technologies named |
| `keyFacts` | `KeyFact[]` | each `{ statement, kind }` |
| `suggestedUse` | string[] | e.g. `blog-seed`, `about-proof`, `project-candidate` |
| `confidentialityFlag` | boolean | true if employer-sensitive material detected |
| `processed` | boolean | false on ingest; true after a Strategist review |

**Body**: cleaned markdown of the source content.

### KeyFact

| Field | Type | Notes |
|-------|------|-------|
| `statement` | string | atomic factual claim |
| `kind` | `'about-marlon' \| 'general'` | `about-marlon` requires human verification before any site use |

## NormalizedFields (Claude output contract)

The subset the normalizer asks Claude to produce; the pipeline supplies
id/sourceType/sourceRef/title/ingestedAt/processed.

`{ summary, tags[], topics[], entities[], keyFacts[], suggestedUse[], confidentialityFlag }`

## IndexRecord → entries of `brain/index.json` (array)

Lightweight catalog for listing, dedupe, and processed-state tracking without opening entries.

`{ id, sourceType, sourceRef, title, ingestedAt, confidentialityFlag, processed }`

## Proposal → `brain/proposals/<date>-<slug>.md` (Strategist output)

Markdown document; see `contracts/formats.md` for the section contract. Fields conveyed:
`type` (blog | copy | project | experience | seo | geo), `rationale`, `sourceEntries` (entry ids),
`draftOrOutline`, `targetFiles`, `unverifiedClaims` (marked `[NEEDS CLARIFICATION]`),
`promoteRecommendation`.

## State transitions

```
(absent) --brain:add--> entry.processed = false  (IndexRecord appended)
entry.processed = false --/brain-review--> entry.processed = true  (proposal(s) written)
proposal --Marlon approves--> /speckit-specify --> new feature spec (leaves brain unchanged)
```

## Relationships

- One **Source** → one **BrainEntry** (dedup by `sourceRef`) → one raw file in `brain/sources/`.
- One **BrainEntry** ↔ one **IndexRecord** (by `id`).
- One **Proposal** cites ≥1 **BrainEntry** (`sourceEntries`).
