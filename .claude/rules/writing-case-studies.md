---
paths:
  - "src/content/narratives/**"
  - "src/content/projects/*pinterest*"
---

# Strategic Case Study Style Guide

Consult this guide AND `.claude/rules/voice-reference.md` when writing or editing strategic case studies (employer work, confidential projects). These are hard requirements.

## Structure

Every strategic case study follows this arc:

1. **Context** — What existed when you arrived. What the landscape looked like. Frame the problem as systemic, not heroic.
2. **Decision Framework** — What options were considered, what was chosen, and why. Show rejected alternatives with reasoning.
3. **Execution** — What was actually done, including course corrections. Not just the happy path.
4. **Reflection** — Specific, actionable principles learned. Not generic platitudes.

### Narrative Arc: Before/After, Not Crisis/Hero

Frame the work as improving a system, not rescuing one. The infrastructure wasn't broken — it was unoptimized, unmonitored, or designed for a different scale.

**DO**: "When I joined the Cloud Infrastructure team, I inherited Transit Gateway infrastructure that had no monitoring in place."
**DON'T**: "The infrastructure was in crisis and desperately needed fixing."

**DO**: "Pinterest's continued growth requires infrastructure that's designed for it."
**DON'T**: "The existing infrastructure was failing to keep up with demands."

## Decision Cards

Every strategic case study MUST include a `decisionCard` in frontmatter with:
- `problem`: What needed solving (specific, not vague)
- `constraints`: Hard boundaries that shaped the decision
- `tradeoffs`: At least 2-3 options, each with pros/cons, one marked `chosen: true`

Show rejected alternatives with honest reasoning. "AWS pricing is non-negotiable" proves you vetted the bad option. Only presenting the chosen option looks like post-hoc justification.

**DO**: Include an option you rejected and explain why honestly.
**DON'T**: Only show the option you chose, making it look like the only possibility.

## Metrics and Confidentiality

Sekou works at a publicly traded company. This repo is public. Follow CLAUDE.md confidentiality rules strictly.

### Allowed Metric Language
- "multi-million dollar" (not exact amounts, not ranges that narrow it)
- "weeks to hours" (relative improvement, not exact timelines)
- "significant annual savings" / "substantial cost reduction"
- "zero production downtime" (specific where it doesn't reveal scale)
- "one month ahead of schedule" (relative to plan, not absolute dates)

### Prohibited
- Exact dollar amounts or ranges ("8-figure", "6-figure")
- Specific instance counts, storage volumes, user counts
- Internal service names, team structures, executive titles
- Forward-looking business statements

### Framing Approach
Be **secret about specifics, generous with concepts**. Describe generically, never use [redacted].

**DO**: "a system streaming large volumes of data between VPCs" (owns the vagueness naturally)
**DON'T**: "a [redacted] system streaming [redacted] GB of data" (draws attention to what's hidden)

## Execution Verbs

Use verbs that reflect strategic scope:
- "designed," "led," "championed," "architected," "established"
- "identified," "diagnosed," "instrumented," "migrated"

**DON'T**: "built," "coded," "implemented" as primary verbs (those are for open-source projects)

## Course Corrections

Every case study should include at least one moment where the approach was adjusted. Real infrastructure work always involves discovering you were wrong about something.

**DO**: "I started by instrumenting the Transit Gateway with basic monitoring, something that should have existed from day one. Once I had visibility, the data told an interesting story."
**DON'T**: Pure "problem identified → solution executed → success" with no friction or adjustment.

## Key Learnings Quality Bar

Closing principles must be **specific to this work**, not generic advice.

**DO**: "TGW has a purpose, and limits. It excels at multi-region transit and complex routing topologies. It's expensive overkill for same-region, high-throughput streaming."
**DON'T**: "Monitor everything, especially costs." (Could apply to any infrastructure project.)

**DO**: "Right-size the solution. Not every infrastructure change requires a 9-month phased migration."
**DON'T**: "Planning is important for large projects." (Too generic to be useful.)

## Voice Consistency

Strategic case studies should maintain a **forensic, reflective** tone throughout. This means:
- Present tense for principles, past tense for actions
- First person for ownership ("I diagnosed," "I led")
- Objective framing for outcomes ("the migration eliminated," "costs dropped")

Avoid shifting between tutorial tone, forensic tone, and future-oriented tone within a single case study. Pick one register and hold it.

## Frontmatter Requirements

```yaml
---
title: 'Descriptive Title'
slug: project-name-company
publishDate: 'YYYY-MM-DD'
description: 'One sentence framing the work and its impact.'
category: strategic
role: 'Tech Lead'  # or Architect, Principal Engineer, etc.
organization: CompanyName
confidential: true  # if employer work
impactSummary: 'What was done and what changed, in 1-2 sentences.'
scale:
  - Metric 1
  - Metric 2
  - Metric 3
primaryTech: [tech1, tech2, tech3]
contributions:
  - Specific contribution 1
  - Specific contribution 2
outcomes:
  - 'Outcome with appropriate vagueness for confidentiality'
decisionCard:
  problem: 'Specific problem statement'
  constraints:
    - 'Hard boundary 1'
  tradeoffs:
    - option: 'Option A'
      pros: ['pro']
      cons: ['con']
      chosen: true
    - option: 'Option B'
      pros: ['pro']
      cons: ['con']
      chosen: false
---
```

## Mentorship References

When mentioning mentorship or team enablement, be specific about *what* you enabled, not just *that* you mentored.

**DO**: "I mentored the team on VPC peering patterns so they could execute similar migrations independently."
**DON'T**: "The engineers I mentored would go on to lead their own initiatives." (Too vague — who? What initiatives?)
