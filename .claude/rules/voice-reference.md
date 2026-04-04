---
paths:
  - "src/content/**"
---

# Voice Reference — Sekou Doumbouya

This file defines Sekou's writing voice. Consult it before writing or editing ANY content in `src/content/`. These are hard requirements, not suggestions.

## Opening Pattern

Always narrative-first. Start with a concrete moment, specific problem, or personal realization. Never open with abstraction, thesis statements, or "In this article, I'll discuss..."

The pattern: **concrete moment → diagnosis → principle**.

**DO**: "The first time I ran five AI agents simultaneously on the same codebase, they stepped on each other's work within thirty seconds."
**DO**: "I once spent three months writing a single document. Not code. Not a Terraform module. A document."
**DO**: "In Mandinka, the language of my tribe, the word for work is *baara*."
**DON'T**: "Multi-agent coordination is a growing challenge in AI engineering..."
**DON'T**: "This post explores the benefits of documentation-as-infrastructure."

## Sentence Rhythm

Short sentences for impact. Longer sentences for explanation. Alternate deliberately.

**DO**: "It was a mess. A fast, impressively parallel, completely useless mess." (punch) → followed by a longer diagnostic paragraph.
**DO**: "That's the credibility tax. You either pay it by staying in the work, or you spend your influence capital on every recommendation and wonder why adoption is slow."
**DON'T**: Uniform sentence length throughout. No monotone paragraphs.

## First-Person Authority

Use "I" frequently but always tied to specific decisions, failures, or learnings. Ground authority in time and experience, not title or role.

**DO**: "Over 20 years, I've mentored more than 20 engineers."
**DO**: "I was wrong, and it took me years to see why."
**DO**: "I've seen architecture decisions made by people who haven't touched production in two years."
**DON'T**: "As a senior engineer, I believe..." (title-based authority)
**DON'T**: "It is well known that..." (passive, impersonal)

## Honesty Markers

Every substantial piece must include at least one moment of admitted uncertainty, limitation, or ongoing learning. This builds credibility, not weakness.

**DO**: "I want to be honest about the limitations."
**DO**: "I'm still learning the details of GPU memory management. Pretending otherwise would be dishonest."
**DO**: "I'm not sure yet whether this is genuinely useful or just architecturally interesting."
**DON'T**: Presenting mastery of a topic you're still learning.
**DON'T**: Omitting the "what doesn't work yet" section to appear more polished.

## Verbal Signatures

These are recurring patterns in Sekou's writing. Use them naturally, not forcedly:

- **"actually"** to signal reality vs. assumption: "What 40/60 Actually Looks Like", "What the Agent SDK Changes"
- **Double-negative truth statements**: "It's not a suggestion. It's a hard rule." / "It's not delegation. It's multiplication." — Clarify what something is NOT, then what it IS.
- **Qualifying confessions**: "I was wrong, and it took me years to see why" / "This is the part where I have to be honest: I was nervous."
- **The blunt declaration**: "Let me be blunt about something." Declare positions. Don't hedge.

## Directness

State positions. Don't suggest or equivocate.

**DO**: "I don't buy it."
**DO**: "The answer is no."
**DO**: "Let me be blunt about something."
**DON'T**: "It could be argued that..."
**DON'T**: "One might consider..."
**DON'T**: "Perhaps it would be beneficial to..."

## Metaphor as Bridge

Explain abstract problems through concrete domain analogies. Each major piece should have at least one anchoring metaphor.

**Examples from existing work**:
- Credibility as currency ("credibility tax," "influence capital")
- Documentation as infrastructure (shared, durable, shapes what's possible)
- Developers as customers (platform engineering as product management)
- Mentoring as multiplication (compounding returns, not charity)
- Agent coordination as team coordination (file ownership = code ownership)

**DON'T**: Use dead metaphors ("journey," "deep dive," "landscape," "ecosystem"). Find specific, earned comparisons.

## Organizational Framing

Frame technical problems as human coordination problems whenever possible. This is Sekou's distinctive lens — 20 years of managing teams applied to technical architecture.

**DO**: "The problems of multi-agent coordination are the same problems of multi-human coordination. File ownership is code ownership. Wave execution is sprint planning."
**DO**: "You don't have two engineers editing the same Terraform module simultaneously."
**DON'T**: Pure technical description without connecting to how people work.

## Tradeoff-First Thinking

Always ask "what is this costing us?" before "what should we build?" Frame decisions as tradeoffs, not features.

**DO**: "I have six production dependencies. Six... Every dependency I didn't add is a dependency I don't have to update, audit, or debug."
**DO**: "What exactly are we getting in return for the centralized model?"
**DON'T**: Presenting a solution without acknowledging what it costs.

## Cultural and Personal Depth

Sekou ties personal identity to professional philosophy. This is rare in tech writing and must be preserved.

- Etymological references (Baara from Mandinka)
- Mentorship through /dev/color
- West African naming conventions in project names (Fakoli, Baara)
- References to underrepresented backgrounds in engineering

Never strip these elements. They are part of the voice, not decoration.

## Closing Pattern

End with a transferable principle, never a summary. The last paragraph should teach something the reader takes away, not recap what was said.

**DO**: "The only sustainable scaling strategy is multiplying competent decision-makers. Everything else is just working harder."
**DO**: "The gap between those two activities is where bad decisions hide. I stay in both because that gap is where my job actually lives."
**DON'T**: "In this article, we covered X, Y, and Z."
**DON'T**: "To summarize the key takeaways..."

## Lists vs. Prose

Use lists for structure and taxonomy. Use prose for meaning and explanation. Never let a list do the work of explaining *why*.

**DO**: List eight agent names (structure), then give each a prose paragraph explaining its philosophy (meaning).
**DON'T**: A bullet list of features with no narrative connecting them.

## Tone Guardrails

- Confident but not arrogant
- Technical but not inaccessible
- Personal but not self-indulgent
- Treats readers as peers, not audiences being lectured
- No filler words, no throat-clearing, no "it goes without saying"
- No emojis unless the user explicitly requests them
