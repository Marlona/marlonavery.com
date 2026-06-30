/**
 * Shared TypeScript interfaces for data structures
 */

export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	topics?: string[];
	fork: boolean;
	private?: boolean;
}

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

/** Build → Learn → Teach → Inspire philosophy step */
export interface PhilosophyStep {
	step: string;
	icon: string;
	description: string;
}

/** "What brings you here?" intent card */
export interface IntentCard {
	icon: string;
	title: string;
	description: string;
	href: string;
}

/** Workshop enrollment wizard step */
export interface WizardStep {
	id: string;
	title: string;
	question: string;
	options: WizardOption[];
	multiSelect?: boolean;
}

export interface WizardOption {
	id: string;
	label: string;
	icon: string;
	description?: string;
}

/** Keynote topic */
export interface KeynoteTopic {
	title: string;
	abstract: string;
	duration: string;
	audience: string[];
	tier?: 'signature' | 'standard';
}

/** Audience outcome column */
export interface AudienceOutcome {
	icon: string;
	title: string;
	outcomes: string[];
}

/** Event planner resource */
export interface EventPlannerResource {
	label: string;
	description: string;
	href: string;
	external?: boolean;
}

/** Testimonial (placeholder structure) */
export interface Testimonial {
	quote: string;
	name: string;
	title: string;
	org: string;
}

/** Lab distribution channel */
export interface LabChannel {
	platform: 'tiktok' | 'instagram' | 'linkedin' | 'youtube';
	handle: string;
	description: string;
}

/** Next.js homepage migration types */
export type HomeProofMetric = {
	value: string;
	label: string;
	highlight?: boolean;
};

export type HomePhilosophyStep = {
	index: string;
	title: string;
	description: string;
};

export type HomePathCard = {
	index: string;
	title: string;
	description: string;
	href: string;
};

export type HomeNumberCard = {
	value: string;
	label: string;
};

export type HomeKeynoteCard = {
	tier: 'Signature' | 'Standard';
	duration: string;
	title: string;
	abstract: string;
	audience: string[];
};

export type HomeEventPreview = {
	date: string;
	title: string;
	venue: string;
};

export type HomeWritingPreview = {
	date: string;
	title: string;
	description: string;
	href: string;
};
