# Contributing to marlonavery.com

Thank you for your interest in contributing! This document provides guidelines for contributing to this portfolio site project.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/marlonavery.com.git
   cd marlonavery.com/marlonaverysite
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:4321`

## Development Workflow

### Branch Naming

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Making Changes

1. Create a new branch from `main`
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes

3. Test your changes
   ```bash
   npm run build    # Ensure build succeeds
   npm run preview  # Preview production build
   ```

4. Commit your changes with a descriptive message
   ```bash
   git commit -m "feat: add new feature description"
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Process

1. **Push your branch** to your fork
   ```bash
   git push origin feat/your-feature-name
   ```

2. **Open a Pull Request** against the `main` branch

3. **Describe your changes** clearly in the PR description:
   - What changes were made
   - Why the changes were necessary
   - Any relevant context or screenshots

4. **Wait for review** - maintainers will review and provide feedback

## Code Style

- Use TypeScript for type safety
- Follow existing code patterns in the codebase
- Use Tailwind CSS for styling
- Keep components modular and reusable

## Content Collections

When adding content, follow the schemas defined in `src/content/config.ts`:

- **Projects** (`src/content/projects/`) - MDX files with frontmatter matching the project schema
- **Blog** (`src/content/blog/`) - MDX files with frontmatter matching the blog schema
- **Experience** (`src/content/experience/`) - JSON files matching the experience schema

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
