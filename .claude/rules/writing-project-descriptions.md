---
paths:
  - "src/content/projects/**"
---

# Open-Source Project Description Style Guide

Consult this guide AND `.claude/rules/voice-reference.md` when writing or editing open-source project descriptions. These are hard requirements.

## Structure

Every project description follows this arc:

1. **Problem** — Why this project exists. What was broken, missing, or frustrating.
2. **Approach** — Design philosophy with subsections named by **concept/principle**, not technology/component.
3. **What I Learned** — Reflection on what was actually hard, what surprised you, and what design decisions were vindicated or regretted.

## Opening Types

Choose one per project. Each must be grounded and specific.

### Personal Friction
Start with a specific frustration that motivated the project.

**DO**: "I got tired of the tradeoff. Every personal finance app I tried wanted my bank credentials."
**DO**: "I spend a lot of time in Claude Code. It's my primary development environment. But sometimes I need a second opinion."

### System Problem
Start with a structural gap in the ecosystem.

**DO**: "MCP is quickly becoming the standard way LLM applications connect to external tools. But the moment you have more than one or two MCP servers, the operational picture gets ugly."

### Gap Identification
Start by framing what's missing for a specific audience.

**DO**: "Individual investors are flying blind compared to institutions. A Bloomberg terminal costs $24,000 per year."

**DON'T** (for any opening type): "This project is a..." / "I built a tool that..." / "In the world of modern AI..."

## Subsection Naming

Name sections by **design principle or concept**, not by technology or component.

**DO**: "Defense in Depth", "The Import Pipeline", "Namespace-Based Routing", "The Iceberg Problem"
**DON'T**: "Security Module", "Backend Architecture", "Configuration", "Implementation Details"

Principle-named sections tell the reader *why*. Component-named sections tell the reader *what*. The *why* is always more valuable.

## Integrating "Why" Into Architecture

Don't defer all reasoning to the "What I Learned" section. Explain *why* you made each design choice as you describe it.

**DO**: "Each agent has a narrow, auditable role. The extraction-synthesis separation turned out to be the most important design decision — it prevents hallucinated certainty by forcing synthesis agents to work only from extracted facts."
**DON'T**: "The system has extraction agents and synthesis agents." (then explain the reasoning 500 words later in reflection)

## Surface the Actual Hard Part

Every project has a part that was harder than expected. Name it. This is what makes project descriptions memorable.

**DO**: "Bank data formats are a mess, and that's the actual product."
**DO**: "Rate limiting is infrastructure, not an afterthought."
**DO**: "The moment you start piping user prompts to external APIs, you inherit a set of security problems."
**DON'T**: Describing only the clean architecture without acknowledging where reality was messy.

## Tradeoff Transparency

Be explicit about what you traded away and why you accepted it.

**DO**: "An in-process tool can crash the host. I accept that tradeoff for a personal system."
**DO**: "Regex-based injection detection is a tradeoff, not a solution."
**DO**: "I have six production dependencies. Six... Every dependency I didn't add is a dependency I don't have to update, audit, or debug."
**DON'T**: Presenting design choices as unambiguously correct.

## Generated vs. Hand-Written Quality Bar

Auto-generated project descriptions (from `npm run generate:case-studies`) tend toward feature-list mode. Always edit generated content to add:

1. **Narrative motivation** — Why was this built? What friction prompted it?
2. **Design reasoning** — Why this approach over alternatives?
3. **A "what was actually hard" moment** — What surprised you during development?
4. **At least one tradeoff acknowledgment** — What did you give up?

Generated projects should not have duplicate information across frontmatter contributions/outcomes and body text. Use frontmatter for structured data, body for narrative.

### Length Targets
- Hand-written: **1,500-2,200 words** body text with narrative flow
- Generated (after editing): **800-1,200 words** minimum with narrative additions

## Code Blocks and Artifacts

Include at least one concrete artifact per project:
- A config snippet showing the design in practice
- A CLI output or interaction example
- A before/after comparison
- A real example of the system handling an edge case

This directly addresses peer feedback: readers want to see the thing working, not just hear about it.

**DO**: Show a YAML config that demonstrates namespace isolation (as MCP Gateway does).
**DON'T**: "The system supports configuration via YAML" with no example.

## Frontmatter Requirements

```yaml
---
title: 'Project Name: Descriptive Subtitle'
slug: project-slug
publishDate: YYYY-MM-DD
description: 'One sentence — what it does and why it matters.'
category: open-source
role: 'Creator & Maintainer'
organization: 'Open Source'
impactSummary: 'What was built and at what scale, in 1-2 sentences.'
scale:
  - 'Quantified metric 1'    # e.g., "30 MCP tools across 9 providers"
  - 'Quantified metric 2'    # e.g., "88.8% test coverage"
  - 'Quantified metric 3'    # e.g., "6 workflow skills"
  - 'Quantified metric 4'    # optional fourth
primaryTech: [tech1, tech2, tech3, tech4, tech5]
contributions:
  - 'Specific architectural/implementation contribution'
outcomes:
  - 'User-facing capability or measurable result'
tags: [relevant, specific, tags]
duration: 'YYYY-Present'
featured: true
repository: 'https://github.com/fakoli/repo-name'
decisionCard:                 # Recommended but optional for smaller projects
  problem: 'What needed solving'
  constraints:
    - 'Hard boundary'
  tradeoffs:
    - option: 'Chosen approach'
      pros: ['pro']
      cons: ['con']
      chosen: true
    - option: 'Rejected approach'
      pros: ['pro']
      cons: ['con']
      chosen: false
---
```

### Scale Metrics

Use **quantified, specific metrics** in the `scale` array. Not vague descriptors.

**DO**: "44 tests passing", "21 OpenAI models supported", "88.8% test coverage"
**DON'T**: "Comprehensive test suite", "Multi-model support", "High test coverage"

## Voice in Project Descriptions

Project descriptions use **more first-person** than blog posts and are **more transparent about tradeoffs**. The tone is "here's what I built and why I made these choices" — not prescriptive, not promotional.

**DO**: "I chose to keep the dependency count low. Six production dependencies."
**DON'T**: "This revolutionary tool transforms the way developers interact with AI models."
