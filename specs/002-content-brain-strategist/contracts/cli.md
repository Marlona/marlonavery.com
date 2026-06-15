# Contract: Brain CLI

The ingestion interface, exposed via npm scripts that wrap `scripts/brain/add.ts`.

## `npm run brain:add -- <source>`

Ingest a single source into the Brain.

- **Argument** `<source>`: a website URL, a YouTube URL, or a path to a local file
  (`.md`, `.txt`, `.pdf`, `.docx`).
- **Type detection**:
  - host matches `youtube.com` or `youtu.be` → `youtube`
  - other `http(s)://` → `web`
  - otherwise → `doc` (validated by extension; unsupported extensions rejected)
- **Behavior**: detect type → ingest (fetch/parse) → normalize via Claude → write
  `brain/entries/<id>.md`, `brain/sources/<id>.<ext>`, and append to `brain/index.json`.
- **Dedupe**: if `sourceRef` already exists in the index, skip with a clear message; exit 0.
- **Success output**: prints the new entry `id`, title, confidentiality flag, and a reminder:
  `Run /brain-review to generate proposals.`
- **Exit codes**: `0` success or duplicate-skip; non-zero on fetch/parse/normalize failure with a
  clear error (e.g., unreachable URL, no transcript, unsupported file type).

## `npm run brain:add:dry -- <source>`

Same as `brain:add` but `DRY_RUN=true`: performs ingest + normalize and prints what *would* be
written, without creating any files or modifying the index.

## `npm run brain:list`

List the current Brain contents from `brain/index.json`: id, type, title, ingested date, and a
clear marker for unprocessed entries. Prints a summary count (total / unprocessed). Exit `0` even
when the Brain is empty (prints an empty-state message).

## Environment

- `ANTHROPIC_API_KEY` (required) — loaded via the existing precedence `process.env` → `.env` →
  `~/.env`.
- `BRAIN_MODEL` (optional) — overrides the normalizer model (default `claude-sonnet-4-6`).
- `DRY_RUN` (optional) — `true` to preview without writing.

## Invariants

- The CLI never writes outside `brain/`.
- The CLI never commits or stages files; `brain/` is gitignored.
- No fabrication: the normalizer extracts only; it must not invent facts not present in the source.
