---
description: "Task list for Content Brain & Strategist Agent (spec 002)"
---

# Tasks: Content Brain & Strategist Agent

**Input**: Design documents from `specs/002-content-brain-strategist/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in the spec — no automated test tasks generated. Validation is via
`quickstart.md` scenarios and `npm run typecheck`.

**Organization**: Tasks grouped by user story (US1–US3) for independent implementation/testing.
Items already implemented this session are pre-checked `[X]`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- File paths are repo-relative from the root.

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Add ingestion dependencies (`jsdom`, `@mozilla/readability`, `turndown`, `youtube-transcript`, `pdf-parse`, `mammoth`, type stubs) to `package.json` devDependencies and install
- [X] T002 Add root-anchored `/brain/` rule to `.gitignore` (must NOT match `scripts/brain/` code)
- [X] T003 Add `brain:add`, `brain:add:dry`, `brain:list` scripts to `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ Blocks all user stories — shared types and the index/store layer.**

- [X] T004 Define shared types in `scripts/brain/lib/types.ts` (RawCapture, BrainEntry, KeyFact, NormalizedFields, IndexRecord, NormalizerConfig)
- [X] T005 Implement brain store + manifest in `scripts/brain/lib/index-manager.ts` (ensure dirs, read/write `brain/index.json`, dedupe by `sourceRef`, `makeEntryId`, write entry/source, append to index)

**Checkpoint**: Foundation ready — ingestion (US1) can be completed.

---

## Phase 3: User Story 1 — Add a Source to the Brain (Priority: P1) 🎯 MVP

**Goal**: Marlon adds a web/YouTube/doc source via one command; it becomes a normalized, private,
deduplicated Brain entry. Listing and dry-run supported.

**Independent Test**: Run `npm run brain:add -- <url|path>` for each type; confirm a well-formed
entry + raw source + index record; confirm dedupe and that nothing is git-tracked (quickstart
Scenarios 1–5).

- [X] T006 [P] [US1] Author the normalization prompt at `scripts/brain/prompts/normalize.md` — instruct Claude to return JSON `NormalizedFields` (summary, tags, topics, entities, keyFacts with `kind`, suggestedUse, confidentialityFlag); enforce NO fabrication and confidentiality-flagging per the constitution; include `docKind`-aware extraction instructions (for `podcast-transcript`: extract speaker insights and Marlon-attributed positions as `about-marlon` facts; for `resume`: extract roles/skills/achievements as `about-marlon` facts)
- [X] T007 [US1] Implement `scripts/brain/lib/normalizer.ts` — Anthropic client + prompt-file loading (reuse pattern from `scripts/lib/claude-generator.ts`), send RawCapture content, parse JSON response into `NormalizedFields`, default model `claude-sonnet-4-6` overridable via `BRAIN_MODEL`
- [X] T008 [P] [US1] Implement web ingestor `scripts/brain/lib/ingestors/web.ts` (fetch → Readability → Turndown markdown)
- [X] T009 [P] [US1] Implement YouTube ingestor `scripts/brain/lib/ingestors/youtube.ts` (transcript via `youtube-transcript`, title via oEmbed; clear error when no transcript)
- [X] T010 [P] [US1] Implement doc ingestor `scripts/brain/lib/ingestors/doc.ts` (md/txt via fs, PDF via `pdf-parse/lib/pdf-parse.js`, docx via `mammoth`; reject unsupported extensions); detect `docKind` from a `--kind` CLI flag or filename heuristic (e.g. `resume`, `cv` in filename → `resume`; `transcript` → `podcast-transcript`; default `general`); pass `docKind` on the returned `RawCapture`
- [X] T011 [US1] Implement CLI `scripts/brain/add.ts` — env loading (`process.env`→`.env`→`~/.env`, reuse case-study pattern), source-type detection, dedupe check, dispatch to ingestor → normalizer → write entry/source + append index, `DRY_RUN` support, success output with reminder to run `/brain-review` (depends on T005, T007, T008, T009, T010)
- [X] T012 [US1] Add `--list` handling to `scripts/brain/add.ts` for `npm run brain:list` (read `brain/index.json`, print type/title/date, mark unprocessed, totals, empty-state) (depends on T011)

**Checkpoint**: US1 fully functional — the Brain ingests, normalizes, dedupes, and lists.

---

## Phase 4: User Story 2 — The Strategist Proposes Site Improvements (Priority: P2)

**Goal**: A Claude Code agent reads unprocessed entries + current site state and writes
propose-only recommendations to `brain/proposals/`, marking entries processed.

**Independent Test**: With unprocessed entries present, run `/brain-review`; confirm proposals are
written (each citing ≥1 entry, with draft/outline, target areas, `[NEEDS CLARIFICATION]` markers),
no `src/` files changed, and entries flip to `processed: true` (quickstart Scenario 6).

- [X] T013 [P] [US2] Create the Strategist subagent at `.claude/agents/content-strategist.md` — system prompt framing it as a website content expert for thought leaders whose primary goal is maximizing Marlon Avery's brand; encode SEO + GEO + thought-leadership positioning expertise; hard guardrails (load `.claude/rules/voice-reference.md`, `.claude/rules/writing-blog-posts.md`, `.specify/memory/constitution.md`; no fabrication; confidentiality; propose-only); for each entry reason explicitly about brand impact (authority-building, discoverability, narrative coherence); tools Read/Grep/Glob/WebFetch + Write scoped to `brain/proposals/`; model `claude-opus-4-8`
- [X] T014 [US2] Create the `/brain-review` skill at `.claude/skills/brain-review/SKILL.md` — load unprocessed entries from `brain/index.json`; load site state (`src/config.ts`, content-collection summaries, `src/pages/llms.txt.ts`, `src/components/common/SEOHead.astro`, `JSONLD.astro`); produce proposals to `brain/proposals/<date>-<slug>.md` per `contracts/formats.md`; mark reviewed entries `processed: true`; report "nothing new" when none (depends on T013)
- [X] T015 [US2] Ensure `index-manager.ts` exposes a helper to update an entry's `processed` flag in both the entry frontmatter and `brain/index.json`, used by the review loop (depends on T005)

**Checkpoint**: US2 functional — running the Strategist yields grounded, propose-only suggestions.

---

## Phase 5: User Story 3 — Promote a Proposal via the Spec Workflow (Priority: P3)

**Goal**: An approved proposal becomes its own feature spec; the Brain/Strategist never bypass the
accuracy/confidentiality/verification gates.

**Independent Test**: Take one proposal and run `/speckit-specify` from it; confirm a normal spec
is produced and the Brain is unchanged (quickstart Scenario 7).

- [X] T016 [US3] Document the proposal→spec promotion loop in `docs/content-brain.md` (how to pick a proposal, run `/speckit-specify`, and that promotion leaves the Brain unchanged); ensure the proposal `Promote?` section in `contracts/formats.md` is reflected in the skill output (depends on T014)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T017 [P] Write `docs/content-brain.md` — overview, directory layout, the `brain:add → /brain-review → promote` loop, confidentiality model, and that `brain/` is gitignored
- [X] T018 [P] Add a "Content Brain" section to `CLAUDE.md` documenting the workflow and the propose-only rule
- [X] T019 [P] Note optional `BRAIN_MODEL` env var in `.env.example` (reuses existing `ANTHROPIC_API_KEY`)
- [X] T020 Run `quickstart.md` Scenarios 1–7 end-to-end and fix any gaps (ingest each type, dry-run, dedupe, confidentiality+gitignore, list, `/brain-review` propose-only, promote)
- [X] T021 Run `npm run typecheck` and confirm the new scripts/agent/skill do not break `astro check`

---

## Dependencies & Execution Order

- **Setup (Phase 1)** ✅ done.
- **Foundational (Phase 2)** ✅ done — blocked all stories; now unblocked.
- **US1 (Phase 3)**: T006 and T007 (normalizer) gate T011; ingestors T008/T009/T010 also gate T011; T012 depends on T011. T008 already done.
- **US2 (Phase 4)**: depends on US1 producing entries; T013 gates T014; T015 supports T014.
- **US3 (Phase 5)**: depends on US2 producing proposals.
- **Polish (Phase 6)**: T017–T019 can run anytime; T020–T021 after US1+US2.

## Parallel Opportunities

- US1: T006, T008, T009, T010 are `[P]` (distinct files). T008 done; author T006 while implementing T009/T010.
- US2: T013 `[P]` (agent file) can be written alongside US1 polish.
- Polish: T017, T018, T019 are independent `[P]` doc edits.

```bash
# US1 parallelizable batch (different files):
Task: "Author scripts/brain/prompts/normalize.md"          # T006
Task: "Implement scripts/brain/lib/ingestors/youtube.ts"   # T009
Task: "Implement scripts/brain/lib/ingestors/doc.ts"       # T010
```

## Implementation Strategy

- **MVP = US1 (Phase 3)**: a working Brain that ingests web/YouTube/docs into normalized,
  deduplicated, private entries and lists them. Stop and validate with quickstart Scenarios 1–5.
- **Increment 2 = US2**: add the Strategist and `/brain-review` for propose-only suggestions.
- **Increment 3 = US3 + Polish**: document the promotion loop and finalize docs; run full
  quickstart + typecheck.
