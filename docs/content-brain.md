# Content Brain & Strategist Agent

A private, local knowledge store that turns your reading material into grounded site improvement proposals — without anything confidential or unverified ever touching version control or the live site.

## Directory layout

```
brain/                     ← gitignored (never committed)
├── index.json             ← lightweight manifest of all entries
├── entries/               ← normalized knowledge entries (gray-matter .md files)
│   └── <id>.md
├── sources/               ← raw captured content for provenance
│   └── <id>.<ext>
└── proposals/             ← Strategist output (propose-only)
    └── <YYYYMMDD>-<slug>.md

scripts/brain/             ← tracked code (not gitignored)
├── add.ts                 ← CLI entry point
├── lib/
│   ├── types.ts
│   ├── index-manager.ts
│   ├── normalizer.ts
│   └── ingestors/
│       ├── web.ts
│       ├── youtube.ts
│       └── doc.ts
└── prompts/
    └── normalize.md

.claude/
├── agents/content-strategist.md   ← Strategist subagent
└── skills/brain-review/SKILL.md   ← /brain-review skill
```

## The workflow

```
brain:add → /brain-review → review proposals → /speckit-specify (promote)
```

### 1. Add a source

```bash
# Web page
npm run brain:add -- https://example.com/article

# YouTube video (requires transcript/captions)
npm run brain:add -- https://www.youtube.com/watch?v=VIDEO_ID

# Local document (auto-detects docKind from filename)
npm run brain:add -- ./notes.md
npm run brain:add -- ./podcast-transcript.txt
npm run brain:add -- ./Marlon_Avery_Resume.pdf

# Override docKind explicitly
npm run brain:add -- ./talk-notes.md --kind podcast-transcript
npm run brain:add -- ./cv.docx --kind resume

# Dry run (preview without writing)
npm run brain:add:dry -- https://example.com/article
```

Supported local file types: `.md`, `.txt`, `.pdf`, `.docx`

`docKind` values (for local docs):
- `podcast-transcript` — extracts speaker insights and Marlon-attributed positions
- `resume` — extracts roles, skills, achievements as verified-before-use facts
- `general` — standard extraction (default)

### 2. List what's in the Brain

```bash
npm run brain:list
```

Shows all entries with type, title, date, and whether each has been reviewed.

### 3. Run the Strategist

In Claude Code:

```
/brain-review
```

The Strategist reads unprocessed entries alongside the current site state and writes proposals to `brain/proposals/`. It never edits `src/` or any live site content.

### 4. Promote a proposal

Review the proposals in `brain/proposals/`. For any you want to act on:

```
/speckit-specify <paste or describe the proposal>
```

This creates a standard feature spec. From there, use the normal plan → tasks → implement → verify flow. The Brain and Strategist never bypass the accuracy, confidentiality, or verification gates.

## Confidentiality model

- **All Brain contents are gitignored.** Running `git status` will never show Brain files.
- Entries whose source contains employer-sensitive material are flagged `confidentialityFlag: true`. The Strategist may reference them only in generalized, non-confidential form.
- `about-marlon` key facts require your verification before being used in any site content. The normalizer marks them separately from general/background knowledge.
- Proposals expose no exact financial figures, internal system names, headcounts, or other prohibited details (see CLAUDE.md for the full confidentiality policy).

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | — | Used for normalization and Strategist reasoning |
| `BRAIN_MODEL` | No | `claude-sonnet-4-6` | Override the normalization model |

Set in `.env`, `~/.env`, or the shell environment.

## Propose-only rule

The Strategist writes only to `brain/proposals/`. It never modifies:
- `src/` (content, components, pages)
- `public/`
- Configuration files
- Any other tracked file

Violating this invariant is a bug. The `/brain-review` skill verifies it after every run.
