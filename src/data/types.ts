/**
 * Shared TypeScript interfaces for data structures
 */

import type { GitHubRepo } from '../utils/github';

// Re-export GitHubRepo for convenience
export type { GitHubRepo };

/**
 * Philosophy/leadership card data
 */
export interface PhilosophyCardData {
	title: string;
	description: string;
	icon: string;
}

/**
 * Focus area preview for homepage
 */
export interface FocusAreaPreview {
	title: string;
	subtitle: string;
	href: string;
}

/**
 * Full focus area data for about page
 */
export interface FocusAreaFull {
	id: string;
	title: string;
	summary: string;
	details: string[];
	metrics: string;
}

/**
 * Statistics display item
 */
export interface StatItem {
	label: string;
	value: string;
}

/**
 * External engagement item for homepage
 */
export interface EngagementItem {
	title: string;
	role: string;
	desc: string;
}

/**
 * External engagement section for about page
 */
export interface EngagementSection {
	title: string;
	items: string[];
}

/**
 * Competency group for skills display
 */
export interface CompetencyGroup {
	title: string;
	skills: string[];
}

/**
 * Education / certification entry
 */
export interface EducationItem {
	school: string;
	location?: string;
	years: string;
	degree?: string;
}

/**
 * Community involvement item
 */
export interface CommunityItem {
	role: string;
	org: string;
	desc: string;
}

/**
 * Quick navigation link item
 */
export interface QuickNavItem {
	href: string;
	title: string;
	description: string;
}

/**
 * Proof strip metric for homepage sticky bar
 */
export interface ProofMetric {
	value: string;
	label: string;
	highlight?: boolean;
	tooltip?: string;
}
