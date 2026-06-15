---
name: "brain-review"
description: "Review unprocessed Content Brain entries against the current site and write propose-only site-improvement proposals (blog/copy/project/SEO/GEO) to brain/proposals/."
argument-hint: "Optional focus, e.g. 'only SEO' or a specific entry id"
user-invocable: true
disable-model-invocation: false
---

# /brain-review

Turn new knowledge in the Content Brain into accurate, grounded proposals for improving Marlon
Avery's site. This is **propose-only**: it writes proposals to `brain/proposals/` and marks
reviewed entries processed. It never edits site content. Approved proposals are later promoted
into specs via `/speckit-specify`.

## Steps

1. **Find unprocessed entries.** Read `brain/index.json`. Select records with `processed: false`.
   - If none, report "Nothing new in the Brain to review." and stop.
   - If the user passed a focus (e.g. an entry id or "only SEO"), narrow accordingly.
   - Read the full entry files for the selected ids from `brain/entries/<id>.md` (frontmatter +
     body), paying attention to `keyFacts` (note which are `about-marlon`), `suggestedUse`, and
     `confidentialityFlag`.

2. **Load current site state** for grounding (read, do not modify):
   - `src/config.ts` — identity, role, social, availability.
   - Content collections under `src/content/` — skim `src/content/config.ts` for schemas and
     list existing `blog/`, `projects/`, `experience/` so proposals don't duplicate what exists.
   - `src/pages/llms.txt.ts` — the GEO profile.
   - `src/components/common/SEOHead.astro` and `src/components/common/JSONLD.astro` — SEO/structured
     data surfaces.

3. **Delegate to the Content Strategist.** Use the `content-strategist` subagent to analyze the
   selected entries against the site state and draft proposals. Pass it the entry ids/content and
   a summary of the relevant site state. The subagent enforces the guardrails (no fabrication,
   confidentiality, voice, propose-only) and writes proposal files.
   - Ensure each proposal is written to `brain/proposals/<YYYYMMDD>-<slug>.md` per
     `specs/002-content-brain-strategist/contracts/formats.md`, cites >= 1 entry id, and marks any
     unverified claim with `[NEEDS CLARIFICATION: ...]`.

4. **Mark entries processed.** After proposals are written, set `processed: true` for every
   reviewed entry id in BOTH `brain/index.json` and each `brain/entries/<id>.md` frontmatter.
   Prefer the helper `markProcessed(ids)` in `scripts/brain/lib/index-manager.ts` (e.g. via a short
   `tsx -e` invocation) so the manifest and entry files stay in sync.

5. **Report.** List the proposal files created, the entries marked processed, and a one-line
   recommendation for which proposals look strongest to promote via `/speckit-specify`.

## Invariants (verify before finishing)

- No files under `src/`, `public/`, or root config were modified (`git status` clean there).
- Every proposal cites at least one Brain entry.
- No confidential specifics appear in any proposal.
