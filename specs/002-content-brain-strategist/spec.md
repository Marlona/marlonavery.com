# Feature Specification: Content Brain & Strategist Agent

**Feature Branch**: `002-content-brain-strategist`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "Build a Content Brain and Strategist Agent for the Marlon Avery portfolio — an ongoing, gitignored knowledge store that ingests websites, YouTube videos, and local docs, normalizes them into structured entries, and a Claude-powered Strategist (SEO/GEO/web-structure/thought-leadership) that reads new entries and proposes site improvements. Propose-only; every real site change flows through the spec-driven workflow. No fabrication; strict employer confidentiality."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Marlon Adds a Source to the Brain (Priority: P1)

Marlon has a useful piece of material — a blog post he wrote elsewhere, a podcast/conference talk on YouTube, or a local notes/resume document. He adds it to the Brain with a single command. The system fetches it, distills it into a structured, searchable knowledge entry (summary, tags, topics, key facts, suggested uses), and stores both the entry and the original source privately. He can do this any time, repeatedly, and the Brain grows.

**Why this priority**: The Brain is the foundation. Without reliable, private, deduplicated ingestion there is nothing for the Strategist to reason over. This story alone delivers value: a growing, structured personal knowledge base.

**Independent Test**: Add a website URL, a YouTube URL, and a local document. Confirm each becomes a normalized entry with a summary, tags, and key facts; confirm the raw source is preserved; confirm re-adding the same source is skipped; confirm nothing landed in version control.

**Acceptance Scenarios**:

1. **Given** a public article URL, **When** Marlon adds it to the Brain, **Then** a structured entry is created with a title, 1–3 sentence summary, tags, topics, entities, key facts, and suggested uses, plus a cleaned readable copy of the article body.
2. **Given** a YouTube video URL, **When** Marlon adds it, **Then** the video's transcript and title are captured and normalized into an entry the same way.
3. **Given** a local file (markdown, text, PDF, or Word document), **When** Marlon adds it, **Then** its text is extracted and normalized into an entry.
4. **Given** a source that was already added, **When** Marlon adds the same source again, **Then** the system detects the duplicate and does not create a second entry.
5. **Given** any ingested source, **When** Marlon inspects the repository's version control status, **Then** none of the Brain's contents (entries, raw sources, index, proposals) appear as tracked or committable files.
6. **Given** a source containing employer-sensitive material, **When** it is normalized, **Then** the resulting entry is flagged as potentially confidential.
7. **Given** facts extracted from a source, **When** the entry is created, **Then** facts asserting things about Marlon are distinguished from general/background knowledge so they can be verified before any site use.

---

### User Story 2 — The Strategist Proposes Site Improvements (Priority: P2)

After new material is in the Brain, Marlon asks the Strategist to review it. The Strategist — an assistant that understands SEO, GEO (optimizing to be cited by AI answer engines), web content structure, and how to position a thought leader — reads the new entries alongside the current state of the site and produces concrete, written proposals: blog post ideas with outlines, copy updates, new project/case-study candidates, and specific SEO/GEO improvements. Each proposal is grounded in real Brain entries and never invents facts. The Strategist writes proposals to a review folder; it never edits the live site.

**Why this priority**: This is the intelligence layer that turns raw knowledge into thought-leadership output. It depends on Story 1 but delivers the core promised value: actionable, accurate suggestions.

**Independent Test**: With several unprocessed entries in the Brain, run the Strategist. Confirm it produces proposal documents that each cite specific source entries, include a concrete draft or outline, name the affected site areas, and flag any unverified claim. Confirm no site content files were modified and the reviewed entries are marked processed.

**Acceptance Scenarios**:

1. **Given** one or more unprocessed Brain entries, **When** the Strategist reviews them, **Then** it produces one or more written proposals saved to the review folder.
2. **Given** a generated proposal, **When** Marlon reads it, **Then** it states its type (e.g., blog, copy update, project, SEO, GEO), the reasoning, which Brain entries it draws from, a concrete draft or outline, and the site areas it would affect.
3. **Given** a fact that cannot be verified from the Brain, **When** the Strategist references it in a proposal, **Then** the proposal marks it as needing clarification rather than stating it as fact.
4. **Given** employer-sensitive material in the Brain, **When** the Strategist drafts proposals, **Then** the proposals do not expose confidential specifics.
5. **Given** a completed review, **When** Marlon inspects the site source, **Then** no site content files were changed by the Strategist.
6. **Given** entries that have been reviewed, **When** the review completes, **Then** those entries are marked as processed so the next review focuses on new material.

---

### User Story 3 — A Proposal Becomes a Shipped Change via the Spec Workflow (Priority: P3)

Marlon reviews the Strategist's proposals, picks the ones worth pursuing, and promotes a chosen proposal into its own specification using the existing spec-driven workflow. From there it is planned, implemented, and verified like any other site change. The Brain and Strategist accelerate ideation but never bypass the project's accuracy, confidentiality, and verification gates.

**Why this priority**: This closes the loop and enforces the constitution. It is lower priority because Stories 1–2 deliver standalone value, but it is what keeps the system safe and trustworthy over time.

**Independent Test**: Take one Strategist proposal and start a new feature spec from it. Confirm a normal spec is produced and the proposal's claims are subject to the standard verification and confidentiality review before any site change ships.

**Acceptance Scenarios**:

1. **Given** a Strategist proposal Marlon approves, **When** he promotes it, **Then** it becomes a standard feature specification entering the normal plan → tasks → implement flow.
2. **Given** a proposal Marlon rejects or defers, **When** he leaves it in the review folder, **Then** no site change occurs and the proposal remains available for later reconsideration.
3. **Given** any site change originating from the Brain, **When** it is implemented, **Then** it passes the same verification and confidentiality checks required of all changes by the constitution.

---

### Edge Cases

- **Unreachable or paywalled source**: fetching fails or returns no readable content → the system reports a clear error and creates no entry.
- **YouTube video without a transcript**: no captions available → the system reports that the transcript could not be retrieved and creates no entry (or an entry flagged as lacking content).
- **Unsupported local file type** (e.g., an image or video): rejected with a clear message; local video/audio transcription is explicitly out of scope for this version.
- **Very large source**: extremely long articles/transcripts are handled without failure (e.g., truncated or chunked for normalization) and the entry notes if content was abbreviated.
- **Source with no clear facts about Marlon**: still ingested as general/background knowledge with an empty "about-Marlon" fact set.
- **Re-review with no new entries**: the Strategist reports there is nothing new to process rather than re-proposing on stale material.
- **Confidential-flagged entry**: remains in the private Brain and may inform proposals only in generalized, non-confidential form.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST let Marlon add a source to the Brain by providing a website URL, a YouTube URL, or a path to a local document, via a simple repeatable command.
- **FR-002**: The system MUST automatically determine the source type (website, YouTube, or local document) from the input.
- **FR-003**: The system MUST support local documents in markdown, plain text, PDF, and Word (.docx) formats.
- **FR-004**: For each source, the system MUST capture a readable rendition of its content (article text, video transcript, or document text) and preserve the original captured material privately for provenance.
- **FR-005**: The system MUST transform each captured source into a structured entry containing: a title, a short neutral summary, tags, topics, named entities, key facts, and one or more suggested uses for the site.
- **FR-006**: The system MUST separate key facts that assert something about Marlon (which require human verification before any site use) from general/background facts.
- **FR-007**: The system MUST flag any entry whose source appears to contain employer-sensitive or confidential material.
- **FR-008**: The system MUST keep all Brain contents — entries, raw source captures, the index, and proposals — out of version control so unapproved or confidential material is never published.
- **FR-009**: The system MUST detect and skip duplicate sources so the same source is not ingested twice.
- **FR-010**: The system MUST let Marlon list what is currently in the Brain and which entries have not yet been reviewed.
- **FR-011**: The system MUST provide a preview/dry-run mode that shows what would be ingested without writing anything.
- **FR-012**: The Strategist MUST review unprocessed Brain entries together with the current state of the site and produce written proposals for site improvements.
- **FR-013**: Proposals MUST cover, as applicable: new blog posts, existing copy updates, new project/case-study candidates, and SEO and GEO improvements.
- **FR-014**: Each proposal MUST state its type, its rationale, the Brain entries it draws from, a concrete draft or outline, and the site areas it would affect.
- **FR-015**: The Strategist MUST NOT fabricate facts; any claim not verifiable from the Brain MUST be explicitly marked as needing clarification.
- **FR-016**: The Strategist MUST NOT modify any live site content; it MUST only write proposals to a dedicated review location.
- **FR-017**: The Strategist MUST respect employer confidentiality, never surfacing confidential specifics in proposals.
- **FR-018**: After a review, the system MUST mark the reviewed entries as processed so subsequent reviews focus on new material.
- **FR-019**: The system MUST allow a Strategist proposal to be promoted into a standard feature specification, keeping all site changes within the spec-driven workflow.
- **FR-020**: The Strategist's guidance MUST be grounded in the project's established voice and the constitution's accuracy and confidentiality rules.

### Key Entities

- **Source**: An external or local item of raw material — a web page, a YouTube video, or a local document — identified by a canonical reference (URL or file path) used for deduplication.
- **Brain Entry**: The normalized, structured knowledge derived from one source: title, summary, tags, topics, entities, key facts (split into about-Marlon vs. general), suggested uses, a confidentiality flag, a processed flag, and a cleaned content body.
- **Index / Manifest**: A lightweight catalog of all entries enabling listing, dedupe, and processed-state tracking without opening every entry.
- **Proposal**: A written, reviewable recommendation produced by the Strategist — typed (blog/copy/project/SEO/GEO), with rationale, cited source entries, a concrete draft or outline, affected site areas, and any unverified-claim markers.
- **Site State**: The current public-facing configuration and content the Strategist reads as grounding (identity/config, content collections, machine-readable profile, structured-data/SEO surfaces).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Marlon can add a source of any supported type and obtain a complete structured entry in a single command, with no manual editing required to produce a usable entry.
- **SC-002**: Across a representative set of at least three sources (one web, one YouTube, one document), 100% are either ingested into a well-formed entry or rejected with a clear, actionable error.
- **SC-003**: Re-adding any already-ingested source results in zero duplicate entries.
- **SC-004**: After any number of ingestions, the repository's version-control status shows zero Brain files staged, tracked, or committable.
- **SC-005**: Every Strategist proposal cites at least one specific Brain entry and contains no factual claim that is unsupported by the Brain or unmarked as needing clarification.
- **SC-006**: A Strategist review run changes zero live site content files.
- **SC-007**: 100% of entries reviewed in a run are marked processed, and a subsequent run with no new material proposes nothing.
- **SC-008**: At least one Strategist proposal can be promoted into a standard feature specification without rework, demonstrating the end-to-end loop.
- **SC-009**: A confidentiality spot-check of generated proposals finds no exact financial figures, internal system names, or other prohibited employer details.

---

## Assumptions

- This version targets a single user (Marlon) running ingestion locally; multi-user access, hosting, and scheduling are out of scope.
- Local video/audio transcription is explicitly deferred to a later phase; only web, YouTube, and local text documents (md/txt/pdf/docx) are supported now.
- Normalization and the Strategist's reasoning are performed by Claude; an API key is available in the environment (the same mechanism the existing case-study generator uses).
- The Brain is stored on the local filesystem in a dedicated, version-control-excluded folder; a database or vector store is unnecessary at the current scale.
- The Strategist runs on demand (invoked by Marlon) rather than automatically; automatic triggering on every ingest is a possible later enhancement.
- "Current site state" the Strategist reads includes site configuration, content collections, the machine-readable profile, and structured-data/SEO surfaces already present in the project.
- Proposals are reviewed by Marlon; approval and promotion into specs are manual human decisions, consistent with the project constitution.
- YouTube ingestion relies on the availability of a transcript/captions for the video.

## Dependencies

- An available Claude API key in the environment for normalization and Strategist reasoning.
- Network access to fetch web pages and YouTube transcripts.
- The existing spec-driven workflow (used to promote approved proposals into specifications).
- The existing project voice guides and constitution (used as grounding and guardrails for the Strategist).
