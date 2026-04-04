---
paths:
  - "src/content/blog/**"
---

# Blog Post Style Guide

Consult this guide AND `.claude/rules/voice-reference.md` when writing or editing blog posts. These are hard requirements.

## Structure

Every blog post follows this arc:

1. **Narrative hook** (1-3 paragraphs) — A specific moment, failure, or realization that grounds the reader. Not a thesis statement. Not "In this article..."
2. **Progressive deepening** — Move from the specific problem to the solution detail to the broader principle. Each section goes deeper, not wider.
3. **Principle-based close** — End by elevating to a transferable lesson. Never summarize. Never recap.

### Section Headings

Headings are **declarative statements**, not questions.

**DO**: "The File Ownership Model", "The Credibility Tax", "What 40/60 Actually Looks Like"
**DON'T**: "How Does File Ownership Work?", "What Is the Credibility Tax?"

### Reading Time

Target **5-8 minutes** (1,200-2,000 words). Go longer only when the depth demands it.

## Peer Feedback Principles

These principles come from peer review of existing posts. Treat them as quality gates.

### Show It In Action

Every conceptual claim needs a **concrete proof artifact**. If you describe a system, show it working. If you describe a process, show its output. The reader should see the thing, not just hear about it.

Proof artifacts include:
- A real code snippet showing the interface or interaction
- A status file excerpt, CLI output, or log entry
- A before/after comparison with specific details
- A diagram or flow showing how components interact
- A real example of the described pattern applied

**DO**: Describe wave execution, then show a real status file from Wave 1 being consumed in Wave 2.
**DON'T**: "The agents communicate through status files" with no example of what a status file looks like.

**DO**: Describe multi-provider architecture, then show a flow or diagram of how a request routes through providers.
**DON'T**: "The system supports 30 models across 3 providers" with no evidence of how that works.

### Precision Over Impression

Claims that sound absolute get questioned. Be precise about scope, boundaries, and what you actually mean.

**DO**: "Your data never leaves your machine. Provider API calls go out, but prompts are logged locally and responses are cached on disk."
**DON'T**: "Everything runs locally" (when you're calling external APIs).

**DO**: "Multi-million dollar annual savings" (appropriately vague for confidentiality).
**DON'T**: Vague where precision is possible, or precise where confidentiality requires vagueness.

### Go Deep on the Hard Parts

When a post identifies what works and what doesn't, spend **more time on what doesn't**. That's where the reader's questions live. Don't balance sections equally when one is more interesting or more useful.

**DO**: In "Cloud Infra to AI Infra" — the "What Doesn't Transfer" section should be the longest because that's the novel insight. What transfers is reassuring; what doesn't is educational.
**DON'T**: Giving "What Transfers" and "What Doesn't Transfer" equal weight when one is clearly more interesting.

### Earned Humor

Include **one or two self-aware moments** per long-form piece. Humor should come from genuine observation, not manufactured jokes. Parenthetical acknowledgment works best.

**DO**: "The irony isn't lost on me: the plugin that manages plugins is maintained by agents specialized in plugin work." (then lean into it — "yes, I hear it")
**DO**: "It was a mess. A fast, impressively parallel, completely useless mess."
**DON'T**: Forced jokes, pop culture references, or meme language.
**DON'T**: Zero humor across 8 minutes of reading. Unbroken seriousness reads as heavy.

## Existing Strengths to Preserve

These patterns appear in the strongest posts. Always include them:

### Replicable Frameworks
The strongest posts extract a method the reader can apply to their own work. Not just "here's what I did" but "here's the framework, and you can use it too."

- Transit Gateway: "Question your defaults regularly," "Follow the money," "IaC is your safety net"
- Documentation: "Start with the why," "Be opinionated," "Include the escape hatch," "Write for the person who disagrees"

### Contradicting Conventional Wisdom
The strongest posts take a position against received wisdom and back it with evidence.

- "Transit Gateway. A service that every architecture blog recommends... was absolutely the wrong choice for our traffic patterns."
- "I spent three months writing a single document... I was building infrastructure."

### Metric/Scorecard Approach
Turn nebulous concepts into measurable frameworks. Give the reader a way to evaluate.

### Honest Limitation Sections
Every post should include a "What Doesn't Work Yet" or equivalent. This is a credibility marker, not a weakness.

## Frontmatter Requirements

```yaml
---
title: "Descriptive Title: Subtitle That Adds Context"
publishDate: YYYY-MM-DD
description: "One sentence that makes the reader want to click."
tags: ["relevant", "specific", "tags"]
draft: false
readingTime: 8
heroImage: "/blog/slug-hero.png"
---
```

- Title should be a claim or frame, not a label. "Documentation Is Infrastructure" not "My Thoughts on Documentation."
- Description is marketing copy — one sentence, active voice, specific value.
- Always include `readingTime`.

## Disclaimer

Any post discussing current-employer-adjacent topics MUST open with:
*The views expressed here are my own and do not represent those of any current or former employer.*
