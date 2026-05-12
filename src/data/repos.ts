/**
 * GitHub repository data and utilities
 */

import { SITE_CONFIG } from '../config';
import type { GitHubRepo } from '../utils/github';

/**
 * Names of pinned repositories to display on homepage
 * Update this list as new flagship repos are added.
 */
export const PINNED_REPO_NAMES: readonly string[] = [
	'ecommerce',
	'qa-app',
	'airbnb-clone',
	'Mini-Netflix',
	'liquidate-loans',
	'hackerrankSolutions-JavaScript',
] as const;

/**
 * Fallback repository data when GitHub API is unavailable.
 * Replace these short descriptions with your own copy as needed.
 */
export const FALLBACK_REPOS: GitHubRepo[] = [
	{
		name: 'ecommerce',
		full_name: `${SITE_CONFIG.githubUsername}/ecommerce`,
		description: 'JavaScript e-commerce experiment exploring product, cart, and checkout flows.',
		html_url: `https://github.com/${SITE_CONFIG.githubUsername}/ecommerce`,
		language: 'JavaScript',
		stargazers_count: 0,
		topics: ['javascript', 'ecommerce'],
	},
	{
		name: 'qa-app',
		full_name: `${SITE_CONFIG.githubUsername}/qa-app`,
		description: 'A Q&A web app exploring conversational interfaces and dynamic content.',
		html_url: `https://github.com/${SITE_CONFIG.githubUsername}/qa-app`,
		language: 'JavaScript',
		stargazers_count: 0,
		topics: ['javascript', 'qa'],
	},
	{
		name: 'airbnb-clone',
		full_name: `${SITE_CONFIG.githubUsername}/airbnb-clone`,
		description: 'Airbnb-style listings clone — a study in modern marketplace UI patterns.',
		html_url: `https://github.com/${SITE_CONFIG.githubUsername}/airbnb-clone`,
		language: 'JavaScript',
		stargazers_count: 0,
		topics: ['javascript', 'marketplace'],
	},
	{
		name: 'Mini-Netflix',
		full_name: `${SITE_CONFIG.githubUsername}/Mini-Netflix`,
		description: 'A small streaming-style UI exploring the consumer entertainment surface.',
		html_url: `https://github.com/${SITE_CONFIG.githubUsername}/Mini-Netflix`,
		language: 'JavaScript',
		stargazers_count: 0,
		topics: ['javascript', 'streaming'],
	},
	{
		name: 'liquidate-loans',
		full_name: `${SITE_CONFIG.githubUsername}/liquidate-loans`,
		description: 'A fintech-flavored experiment exploring loan liquidation flows.',
		html_url: `https://github.com/${SITE_CONFIG.githubUsername}/liquidate-loans`,
		language: 'JavaScript',
		stargazers_count: 0,
		topics: ['javascript', 'fintech'],
	},
	{
		name: 'hackerrankSolutions-JavaScript',
		full_name: `${SITE_CONFIG.githubUsername}/hackerrankSolutions-JavaScript`,
		description: 'A working notebook of JavaScript HackerRank solutions and patterns.',
		html_url: `https://github.com/${SITE_CONFIG.githubUsername}/hackerrankSolutions-JavaScript`,
		language: 'JavaScript',
		stargazers_count: 0,
		topics: ['javascript', 'algorithms'],
	},
];

/**
 * Merges live repo data with fallback data, using fallback for any nulls
 * If all repos are null (API unavailable), returns all fallbacks
 */
export function mergeReposWithFallback(
	repoData: (GitHubRepo | null)[],
	fallbacks: GitHubRepo[]
): GitHubRepo[] {
	if (repoData.every((repo) => repo === null)) {
		return fallbacks;
	}

	return repoData
		.map((repo, index) => repo || fallbacks[index] || null)
		.filter((repo): repo is GitHubRepo => repo !== null);
}
