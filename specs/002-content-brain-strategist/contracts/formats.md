# Contract: File Formats

## Brain entry — `brain/entries/<id>.md`

gray-matter file. Frontmatter conforms to `BrainEntryFrontmatter` (see `data-model.md`); body is
the cleaned markdown of the source. Example:

```markdown
---
id: web-marlonavery-com-about-20260615
sourceType: web
sourceRef: https://marlonavery.com/about
title: About — Marlon Avery
ingestedAt: 2026-06-15T18:30:00.000Z
summary: Marlon's about page describing his platform-engineering focus and current role.
tags: [platform-engineering, about, bio]
topics: [career, infrastructure]
entities: [Marlon Avery, AWS, Kubernetes]
keyFacts:
  - statement: Marlon describes himself as a platform engineer.
    kind: about-marlon
  - statement: Platform engineering emphasizes developer enablement.
    kind: general
suggestedUse: [about-proof, blog-seed]
confidentialityFlag: false
processed: false
---

Cleaned markdown body of the source…
```

## Index manifest — `brain/index.json`

A JSON array of `IndexRecord` objects, pretty-printed:

```json
[
  {
    "id": "web-marlonavery-com-about-20260615",
    "sourceType": "web",
    "sourceRef": "https://marlonavery.com/about",
    "title": "About — Marlon Avery",
    "ingestedAt": "2026-06-15T18:30:00.000Z",
    "confidentialityFlag": false,
    "processed": false
  }
]
```

## Proposal — `brain/proposals/<YYYYMMDD>-<slug>.md`

Each Strategist proposal is one markdown file with this section contract:

```markdown
---
type: blog            # blog | copy | project | experience | seo | geo
title: <short proposal title>
createdAt: <ISO datetime>
sourceEntries: [<entry id>, ...]   # MUST cite ≥1 brain entry
status: draft         # draft | promoted | rejected
---

## Rationale
Why this is worth doing now, grounded in the cited entries and current site state.

## Draft / Outline
A concrete blog draft/outline, copy rewrite, project description, or specific SEO/GEO change.

## Target Site Areas
Which files/pages/collections this would affect (e.g., src/content/blog/, src/config.ts,
src/pages/llms.txt.ts), described — not edited.

## Unverified Claims
Any factual claim not supported by the Brain, each marked [NEEDS CLARIFICATION: ...].
"None" if fully grounded.

## Promote?
Recommendation on whether to promote via /speckit-specify, and a suggested spec scope.
```

### Proposal invariants

- Cites at least one brain entry in `sourceEntries`.
- Contains no fabricated facts; anything unverifiable appears under **Unverified Claims** as
  `[NEEDS CLARIFICATION]`.
- Exposes no confidential employer specifics (only generalized framing).
- Is advisory only — writing a proposal never modifies site content.
