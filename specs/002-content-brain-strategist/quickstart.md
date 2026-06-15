# Quickstart & Validation: Content Brain & Strategist Agent

Runnable scenarios that prove the feature works end to end. Maps to the spec's Success Criteria.

## Prerequisites

- Dependencies installed (`npm install`).
- `ANTHROPIC_API_KEY` available via `process.env`, `.env`, or `~/.env`.
- Run all commands from the repo root.

## Scenario 1 — Ingest each source type (SC-001, SC-002)

```bash
npm run brain:add -- https://<a-public-article-url>
npm run brain:add -- https://www.youtube.com/watch?v=<id>
npm run brain:add -- ./path/to/notes.md      # also try a .pdf and a .docx
```

**Expected**: each command prints a new entry id + title; `brain/entries/<id>.md` exists with a
populated summary, tags, and keyFacts; `brain/sources/<id>.<ext>` holds the raw capture;
`brain/index.json` gains a record with `processed: false`.

## Scenario 2 — Dry run writes nothing (SC-001)

```bash
npm run brain:add:dry -- https://<a-public-article-url>
```

**Expected**: prints what would be ingested; `git status` and `brain/` show no new/changed files.

## Scenario 3 — Dedupe (SC-003)

```bash
npm run brain:add -- https://<same-article-url-as-scenario-1>
```

**Expected**: prints a "already in brain, skipping" message; no second entry; index unchanged.

## Scenario 4 — Confidentiality flag + gitignore (SC-004, US1 #6)

```bash
# Create a doc with employer-sensitive-sounding content, then:
npm run brain:add -- ./sensitive-note.md
git status --short
git check-ignore brain/
```

**Expected**: the entry's `confidentialityFlag` is `true`; `git status` shows **nothing** under
`brain/`; `git check-ignore brain/` prints `brain/` (ignored). `scripts/brain/` remains tracked.

## Scenario 5 — List the brain (FR-010)

```bash
npm run brain:list
```

**Expected**: lists all entries with type/title/date and marks unprocessed ones; prints totals.

## Scenario 6 — Strategist review is propose-only (SC-005, SC-006, SC-007)

```bash
# In Claude Code:
/brain-review
```

**Expected**:
- One or more files appear in `brain/proposals/`, each citing ≥1 brain entry, with a concrete
  draft/outline, target site areas, and any unverified claims marked `[NEEDS CLARIFICATION]`.
- `git status` shows **no** changes under `src/` (propose-only invariant).
- Reviewed entries flip to `processed: true` in `brain/index.json`.
- Running `/brain-review` again with no new entries reports nothing to do.

## Scenario 7 — Promote a proposal (SC-008)

```bash
# In Claude Code, pick a proposal and:
/speckit-specify <proposal summary>
```

**Expected**: a normal feature spec is created under `specs/`; the brain is unchanged.

## Build health

```bash
npm run typecheck
```

**Expected**: passes (the new scripts and agent/skill do not break `astro check`).
