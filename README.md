# Marlon Avery — Portfolio

A high-performance, accessible, and SEO-optimized portfolio site built with [Astro](https://astro.build). Designed to showcase Marlon Avery's work in Generative AI, voice systems, and applied AI leadership.

## Tech Stack

- **Framework:** [Astro 5.0](https://astro.build)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Content:** MDX (Markdown + JSX) & type-safe content collections
- **Deployment:** Static hosting (any provider)
- **SEO:** Automatic sitemap, Open Graph tags, JSON-LD structured data

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/Marlona/marlonavery.com.git
cd marlonavery.com/marlonaverysite
npm install
```

### Local Development

Start the dev server at `http://localhost:4321`:

```bash
npm run dev
```

### Building for Production

Build the site to the `dist/` directory:

```bash
npm run build
```

## Managing Content

This site uses **Astro Content Collections** for type-safe content management.

### Projects (`src/content/projects/`)
Add new case studies as `.md` or `.mdx` files.
- **Required:** `title`, `publishDate`, `description`, `organization`, `role`, `impactSummary`, `primaryTech`
- **Optional:** `featured`, `scale`, `outcomes`, `contributions`

### Blog (`src/content/blog/`)
Add new articles as `.md` or `.mdx` files.
- **Required:** `title`, `publishDate`, `description`
- **Features:** Supports `draft: true`

### Experience (`src/content/experience/`)
Manage work history and ventures as JSON files.

## Deployment & Configuration

The site supports both root-level domains (e.g., `marlonavery.com`) and subpath deployments.

### Environment Variables

Create a `.env` file in `marlonaverysite/`:

```ini
# Custom domain (root)
SITE=https://marlonavery.com
PUBLIC_BASE_PATH=/

# Optional: GitHub API token for live repository data on the homepage.
# Without this, the site uses cached fallback data.
GITHUB_TOKEN=your_github_personal_access_token_here
```

## AI & LLM Optimization

The site exposes `/llms.txt` and `/llms-full.txt` so AI models (Claude, ChatGPT, Gemini, etc.) can accurately summarize Marlon's professional profile.

## License

[MIT License](LICENSE).
