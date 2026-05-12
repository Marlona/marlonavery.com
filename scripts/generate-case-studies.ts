#!/usr/bin/env npx tsx
/**
 * Build-time script to auto-generate case study MDX files from GitHub repositories
 *
 * Usage:
 *   npm run generate:case-studies    # Generate case studies
 *   npm run generate:dry             # Dry run (show what would be generated)
 *
 * Environment variables (checked in order: process.env, .env, ~/.env):
 *   GITHUB_TOKEN        - GitHub token for API access (optional, but needed for pinned repos)
 *   ANTHROPIC_API_KEY   - Anthropic API key for Claude (required for generation)
 *   DRY_RUN            - Set to "true" to skip actual generation
 *   REPO_SOURCE        - Which repos to fetch: "pinned", "stars", or "both" (default: "both")
 *   CLEAN_GENERATED    - Set to "true" to delete all generated case studies
 *   PROMPT_TEMPLATE    - Path to custom prompt template (default: scripts/prompts/case-study.md)
 *   SYSTEM_PROMPT      - Path to custom system prompt (default: scripts/prompts/system.md)
 *   CLAUDE_MODEL       - Claude model to use (default: claude-sonnet-4-20250514)
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { loadEnv } from 'vite';
import { fetchTargetRepos } from './lib/github-fetcher.js';
import { generateCaseStudy } from './lib/claude-generator.js';
import {
  getExistingCaseStudies,
  hasExistingCaseStudy,
  writeCaseStudy,
  cleanGeneratedCaseStudies,
} from './lib/mdx-manager.js';
import type { RepoSource, GeneratorConfig } from './lib/types.js';

// Configuration
const GITHUB_USERNAME = 'Marlona';
const PROJECTS_DIR = 'src/content/projects';
const REPO_LIMIT = 20;
const EXCLUDE_REPOS = ['marlonavery.com', 'marlonavery']; // Exclude portfolio repo

/**
 * Parse a .env file and return key-value pairs
 */
function parseEnvFile(filepath: string): Record<string, string> {
  if (!existsSync(filepath)) {
    return {};
  }

  try {
    const content = readFileSync(filepath, 'utf-8');
    const result: Record<string, string> = {};

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) continue;

      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        result[key] = value;
      }
    }

    return result;
  } catch {
    return {};
  }
}

async function main() {
  console.log('🚀 Case Study Generator\n');

  // Load environment variables from multiple sources
  // Priority: process.env > .env (project) > ~/.env (global)
  const projectEnv = loadEnv('production', process.cwd(), '');
  const homeEnv = parseEnvFile(join(homedir(), '.env'));

  const githubToken = process.env.GITHUB_TOKEN || projectEnv.GITHUB_TOKEN || homeEnv.GITHUB_TOKEN;
  const anthropicKey = process.env.ANTHROPIC_API_KEY || projectEnv.ANTHROPIC_API_KEY || homeEnv.ANTHROPIC_API_KEY;
  const dryRun = process.env.DRY_RUN === 'true';

  // Parse repo source (pinned, stars, or both)
  const rawSource = process.env.REPO_SOURCE || projectEnv.REPO_SOURCE || homeEnv.REPO_SOURCE || 'both';
  const repoSource: RepoSource = ['pinned', 'stars', 'both'].includes(rawSource)
    ? (rawSource as RepoSource)
    : 'both';

  // Prompt customization
  const promptTemplate = process.env.PROMPT_TEMPLATE || projectEnv.PROMPT_TEMPLATE || homeEnv.PROMPT_TEMPLATE;
  const systemPrompt = process.env.SYSTEM_PROMPT || projectEnv.SYSTEM_PROMPT || homeEnv.SYSTEM_PROMPT;
  const claudeModel = process.env.CLAUDE_MODEL || projectEnv.CLAUDE_MODEL || homeEnv.CLAUDE_MODEL;

  // Check for clean mode
  const cleanGenerated = process.env.CLEAN_GENERATED === 'true';

  if (dryRun) {
    console.log('📋 DRY RUN MODE - No files will be written/deleted\n');
  }

  // Handle clean mode
  if (cleanGenerated) {
    console.log('🧹 Clean Mode - Removing generated case studies\n');
    const deleted = await cleanGeneratedCaseStudies(PROJECTS_DIR, dryRun);
    console.log(`\n📊 Summary: ${deleted.length} generated case studies ${dryRun ? 'would be ' : ''}deleted`);
    return;
  }

  // Check for Anthropic API key
  if (!anthropicKey) {
    console.log('⚠️  ANTHROPIC_API_KEY not set. Skipping case study generation.');
    console.log('   Set this in .env, ~/.env, or as an environment variable to enable generation.\n');
    return;
  }

  // Log configuration
  console.log(`📋 Configuration:`);
  console.log(`   Repo source: ${repoSource}`);
  if (githubToken) {
    console.log('   GitHub token: ✅ detected');
  } else {
    console.log('   GitHub token: ⚠️  not set (pinned repos require auth)');
  }
  if (promptTemplate) {
    console.log(`   Prompt template: ${promptTemplate}`);
  }
  if (systemPrompt) {
    console.log(`   System prompt: ${systemPrompt}`);
  }
  if (claudeModel) {
    console.log(`   Model: ${claudeModel}`);
  }
  console.log('');

  // Get existing case studies
  const existing = await getExistingCaseStudies(PROJECTS_DIR);
  console.log(`📁 Found ${existing.size} existing case studies\n`);

  // Fetch target repositories
  const repos = await fetchTargetRepos(GITHUB_USERNAME, {
    token: githubToken,
    limit: REPO_LIMIT,
    excludeRepos: EXCLUDE_REPOS,
    source: repoSource,
  });

  if (repos.length === 0) {
    console.log('❌ No repositories found. Check your GitHub username and token.\n');
    return;
  }

  console.log('');

  // Process each repository
  let generated = 0;
  let skipped = 0;

  for (const repo of repos) {
    // Check if case study already exists
    if (hasExistingCaseStudy(repo.name, repo.html_url, existing)) {
      console.log(`⏭️  Skipping ${repo.name} (case study exists)`);
      skipped++;
      continue;
    }

    console.log(`📝 Generating case study for ${repo.name}...`);

    if (dryRun) {
      console.log(`   [DRY RUN] Would generate: ${repo.name}`);
      console.log(`   - Stars: ${repo.stargazers_count}`);
      console.log(`   - Language: ${repo.language || 'N/A'}`);
      console.log(`   - Topics: ${repo.topics.join(', ') || 'None'}`);
      console.log(`   - Has README: ${repo.readme ? 'Yes' : 'No'}`);
      console.log('');
      generated++;
      continue;
    }

    try {
      const generatorConfig: GeneratorConfig = {
        apiKey: anthropicKey,
        promptTemplate,
        systemPrompt,
        model: claudeModel,
      };
      const caseStudy = await generateCaseStudy(repo, generatorConfig);
      const outputPath = `${PROJECTS_DIR}/${repo.name}.mdx`;
      await writeCaseStudy(caseStudy, outputPath);
      console.log(`✅ Generated: ${outputPath}`);
      generated++;

      // Rate limit between API calls (1 second)
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error(`❌ Failed to generate case study for ${repo.name}:`, error);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total repos: ${repos.length}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
