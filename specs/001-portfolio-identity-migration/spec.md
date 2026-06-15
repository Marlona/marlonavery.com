# Feature Specification: Portfolio Identity Migration

**Feature Branch**: `001-portfolio-identity-migration`

**Created**: 2026-06-15

**Status**: Draft

**Input**: User description: "We are building a spec-driven personal portfolio for Marlon Avery: an Astro-based site where every content, design, and identity change starts from a clear written spec before implementation. The goal is to migrate the existing Sekou Doumbouya portfolio into an accurate, public-ready Marlon Avery site. Specs will define what content changes, what facts are approved, what pages and metadata are affected, and how each change is verified before it ships."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor Sees Marlon Avery Everywhere (Priority: P1)

A visitor lands on any page of the site and sees only Marlon Avery's name, identity, and contact information. No page, heading, metadata field, structured data block, machine-readable file, or downloadable asset references "Sekou Doumbouya" as the site owner.

**Why this priority**: This is the minimum viable outcome. If any public-facing surface still shows the old identity, the site is not launchable. All other stories build on a clean identity baseline.

**Independent Test**: Open the home page, about page, contact page, and the `/llms.txt` endpoint in a browser. Check the page `<title>`, `<meta name="description">`, Open Graph tags, JSON-LD structured data, the visible hero name, the footer, and the resume download link. All must read "Marlon Avery." Run a full-repo text search for "Sekou" and "Doumbouya" confined to public-facing source files — zero matches expected.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the home page, **When** they read the hero section and page title, **Then** they see "Marlon Avery" (not "Sekou Doumbouya") as the site owner's name.
2. **Given** a web crawler indexes the site, **When** it reads `<title>`, Open Graph `og:title`, and JSON-LD `name` fields, **Then** every field returns "Marlon Avery."
3. **Given** a visitor clicks the resume download link, **When** the file downloads, **Then** the filename and PDF content identify the document as Marlon Avery's resume.
4. **Given** an AI assistant fetches `/llms.txt`, **When** it reads the name and identity fields, **Then** it finds "Marlon Avery" with accurate role, email, and availability.
5. **Given** a developer runs a text search for "Sekou" or "Doumbouya" across all files that render into public output, **When** the search completes, **Then** zero matches are found in public-facing source files.

---

### User Story 2 — Marlon's Approved Content Is Accurate and Complete (Priority: P2)

Every piece of content visible on the site — bio, work history, project descriptions, contact information, and social links — reflects only facts that Marlon Avery has explicitly approved. No fabricated metrics, invented employers, assumed credentials, or embellished claims appear anywhere.

**Why this priority**: Accuracy is a hard requirement for a professional portfolio representing a real person. False claims create legal and reputational risk. This story defines what "approved content" means and confirms each content surface has been populated with real, verified information.

**Independent Test**: Read each content surface (bio, experience entries, project case studies, contact details, social links) against the approved source material Marlon provided. Confirm every metric, employer name, date, and achievement traces to an approved source. Confirm placeholder markers `[NEEDS CLARIFICATION]` or similar do not appear in rendered output.

**Acceptance Scenarios**:

1. **Given** a visitor reads the About page bio, **When** they review Marlon's stated role, background, and skills, **Then** every claim matches approved source material with no invented details.
2. **Given** a visitor browses the Experience section, **When** they read employer names, dates, and responsibilities, **Then** all entries reflect real, Marlon-confirmed history with no embellishment.
3. **Given** a visitor reads a project case study, **When** they encounter any metric or outcome, **Then** the figure is explicitly approved by Marlon or replaced with a clearly marked placeholder.
4. **Given** a visitor tries to contact Marlon, **When** they use the listed email or social link, **Then** the contact information is accurate and reachable.
5. **Given** a content author searches for placeholder markers in rendered HTML, **When** they scan all public pages, **Then** no `[X]`, `[NEEDS CLARIFICATION]`, or `[specific metric]` tokens appear.

---

### User Story 3 — Site Passes Public Safety Review (Priority: P3)

All site content is safe for a current employee at a publicly traded company to publish on a public repository and public URL without employer approval. No confidential financial figures, internal system names, unreleased scale metrics, org structure details, vendor partnership specifics, or forward-looking business statements appear anywhere.

**Why this priority**: The repository is public. A violation here creates immediate risk for Marlon. This story confirms that the content confidentiality standard established in the constitution is satisfied across all pages and generated files.

**Independent Test**: Review every employer-adjacent content block (experience narratives, blog posts, project descriptions referencing current employer) against the confidentiality rules. Confirm no dollar amounts, exact user counts, storage volumes, internal service names, executive titles, or strategic roadmap references appear. Confirm blog posts and narratives discussing the current employer use a "views are my own" disclaimer.

**Acceptance Scenarios**:

1. **Given** a reviewer reads all experience narratives and blog posts, **When** they check for confidential employer data, **Then** no exact financial figures, internal names, or unreleased metrics appear.
2. **Given** a reviewer scans all content for scale language, **When** they encounter descriptions of employer systems, **Then** all references use approved generalizations (e.g., "hyperscale," "multi-million") rather than specific figures.
3. **Given** a blog post discusses work at Marlon's current employer, **When** a reader views it, **Then** a "views are my own" disclaimer is present.
4. **Given** an employer's legal team reviews the site, **When** they check for material non-public information, **Then** no forward-looking business statements, growth targets, or internal roadmap details appear.

---

### Edge Cases

- What happens if a Sekou Doumbouya reference appears only in a comment, private frontmatter field, or non-rendered file? (Spec decision: references in non-public files are acceptable but must be clearly labeled as source/migration material — they MUST NOT leak into rendered HTML.)
- What if approved content for a section is not yet available from Marlon? (Spec decision: use an explicit `[NEEDS CLARIFICATION: <field>]` placeholder in the source, exclude that section from rendered output, and mark the section incomplete in the migration checklist.)
- What if a case study references a forked repository? (Per CLAUDE.md: forked repos MUST NOT be included as case studies — remove them.)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All public-facing pages MUST display "Marlon Avery" as the site owner's name in headings, page titles, and body copy.
- **FR-002**: Structured data (JSON-LD), Open Graph tags, and `<meta>` descriptions MUST identify the site owner as Marlon Avery.
- **FR-003**: The `/llms.txt` machine-readable profile MUST reflect Marlon Avery's name, role, email (`hi@marlonavery.com`), GitHub username, LinkedIn username, and current availability.
- **FR-004**: The resume download asset MUST be named for Marlon Avery (e.g., `Marlon_Avery_Resume.pdf`) and contain only Marlon's verified information.
- **FR-005**: `src/config.ts` MUST define `SITE_CONFIG` values for Marlon Avery (name, email, GitHub username, LinkedIn username, domain, `availableForHire`).
- **FR-006**: Content collections (`src/content/experience/`, `src/content/projects/`, `src/content/blog/`, `src/content/narratives/`) MUST contain only Marlon Avery's approved content or explicit placeholders — no Sekou Doumbouya content in rendered output.
- **FR-007**: Data modules (`src/data/about.ts`, `src/data/homepage.ts`, `src/data/contact.ts`) MUST reflect Marlon Avery's identity and approved facts.
- **FR-008**: The site footer, navigation, and contact page MUST display Marlon Avery's name and contact details.
- **FR-009**: All employer-adjacent content MUST satisfy the confidentiality rules defined in the constitution: no exact financial figures, no internal system names, no unreleased scale metrics, no org structure details.
- **FR-010**: Blog posts and narratives discussing current-employer-adjacent work MUST include a "views are my own" disclaimer.
- **FR-011**: A post-migration search MUST confirm zero occurrences of "Sekou" or "Doumbouya" in public-facing source files (those that compile into rendered HTML, metadata, or downloadable assets).
- **FR-012**: Case studies MUST only cover non-forked, public repositories owned or meaningfully contributed to by Marlon Avery.

### Key Entities

- **Site Identity**: The canonical set of identity attributes for Marlon Avery — name, email, domain, GitHub username, LinkedIn username, `availableForHire` flag, current role/company. Source of truth: `src/config.ts`.
- **Content Surface**: Any file or data module that contributes text, metadata, or structured data to a rendered page or downloadable asset (pages, layouts, content collections, data modules, llms.txt, resume PDF).
- **Migration Touchpoint**: A specific location in the codebase where a Sekou Doumbouya reference exists and must be replaced, removed, or deliberately preserved as labeled source material.
- **Approved Fact**: A piece of content (name, metric, employer, date, credential) that Marlon Avery has explicitly confirmed is accurate and safe to publish.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A full-repo text search for "Sekou" and "Doumbouya" returns zero matches in all files that render into public output (pages, layouts, data modules, content collections, structured data, llms.txt, resume).
- **SC-002**: Every public page passes a spot-check confirming the displayed name, page title, and meta description all read "Marlon Avery."
- **SC-003**: The resume download produces a file named `Marlon_Avery_Resume.pdf` (or equivalent Marlon-named variant) that opens without Sekou Doumbouya references.
- **SC-004**: `/llms.txt` returns Marlon Avery's name, email (`hi@marlonavery.com`), and current availability — confirmed by fetching the endpoint.
- **SC-005**: A content review confirms every visible metric, employer name, date, and credential in experience and project sections traces to Marlon-approved source material, with no fabricated data.
- **SC-006**: A confidentiality review confirms no prohibited content (exact financials, internal names, unreleased metrics, forward-looking statements) appears on any public page.
- **SC-007**: The site builds successfully (`npm run build`) with zero errors and zero type errors (`npm run typecheck`) after migration.

---

## Assumptions

- Marlon Avery's approved identity baseline is: name "Marlon Avery," email `hi@marlonavery.com`, GitHub username `marlonavery` (or as set in `src/config.ts`), LinkedIn username to be confirmed, `availableForHire` value to be confirmed.
- The migration replaces Sekou Doumbouya content with Marlon Avery content; it does not redesign the site or change the technology stack.
- Content that Marlon has not yet approved will be replaced with explicit placeholders and excluded from rendered output rather than fabricated.
- The `sekoudoumbouya-resume.txt` file is retained as private source material (not deleted) but MUST NOT be linked or compiled into any public output.
- Case studies and blog posts that are specific to Sekou Doumbouya's identity and cannot be meaningfully attributed to Marlon will be removed or replaced — not carried over.
- The Astro content collection schemas in `src/content/config.ts` remain unchanged; only the content within collections changes.
- Deployment and GitHub Actions configuration are out of scope unless they expose identity information (e.g., commit author, deploy badge).
- Voice/style guides (`.claude/rules/`) are reference material for Marlon's writing style and will be updated to reflect Marlon's voice in a separate spec.

## Content Sourcing (Future Task)

Before implementation begins, the following public sources should be scraped and reviewed by Marlon to produce approved content for the site. All gathered facts must be explicitly confirmed before use — nothing is applied directly from these sources without review.

| Source | URL | What to Extract |
| ------ | --- | --------------- |
| Marlon's site | `https://marlonavery.com` | Bio, project descriptions, experience entries, contact info, and any published content to carry forward |
| GitHub profile | `https://github.com/marlonavery` | Public bio, location, company, website, pinned repos (name, description, stars, language) |
| LinkedIn profile | To be confirmed (handle unknown) | Current role, employment history, headline, summary, skills, education |

**How to use**: Once gathered, Marlon reviews the extracted content and marks each fact as approved, needs-edit, or exclude. Approved facts are then used to populate `src/config.ts`, content collections, `src/data/`, and the resume asset. This replaces any placeholder values currently in the codebase.
