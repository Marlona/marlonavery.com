/**
 * Homepage content data
 */

import { getBasePath } from '../utils/paths';
import type {
	StatItem,
	PhilosophyCardData,
	FocusAreaPreview,
	EngagementItem,
	QuickNavItem,
	ProofMetric,
} from './types';

export const PROOF_METRICS: ProofMetric[] = [
	{ value: '10+', label: 'Years in GenAI', highlight: false },
	{ value: '10K+', label: 'Scholarships', highlight: true },
	{ value: '80+', label: 'Workshops', highlight: false },
	{ value: '5+', label: 'Ventures', highlight: false },
];

export const STATS: StatItem[] = [
	{ label: 'Years in Generative AI', value: '10+' },
	{ label: 'Scholarships Awarded', value: '10K+' },
	{ label: 'Workshops Delivered', value: '80+' },
	{ label: 'Ventures Founded', value: '5+' },
];

export const PHILOSOPHY_CARDS: PhilosophyCardData[] = [
	{
		title: 'AI Should Reduce Fear',
		description:
			'Most resistance to AI is anxiety dressed up as skepticism. I build and teach with that in mind.',
		icon: '🌱',
	},
	{
		title: 'Voice Is the New UI',
		description:
			'Conversation is the most natural interface humans have. The next decade of software will sound, not just look.',
		icon: '🎙️',
	},
	{
		title: 'Operator-Builder',
		description:
			'I ship the systems I lead. Strategy without keyboard time produces decks, not products.',
		icon: '⚡',
	},
	{
		title: 'Equity By Design',
		description:
			'10K+ scholarships through Pledge to Equality. Access compounds — and so does its absence.',
		icon: '🤝',
	},
];

export function getFocusAreasPreviews(): FocusAreaPreview[] {
	const base = getBasePath();
	return [
		{
			title: 'Voice AI',
			subtitle: 'Receptionists & Call Centers',
			href: `${base}/about#voice-ai`,
		},
		{
			title: 'AI Agents',
			subtitle: 'Long-Running Workflows',
			href: `${base}/about#ai-agents`,
		},
		{
			title: 'Applied LLMs',
			subtitle: 'GPT for Real Work',
			href: `${base}/about#applied-llms`,
		},
		{
			title: 'AI Education',
			subtitle: 'AImpact Workshops',
			href: `${base}/about#ai-education`,
		},
		{
			title: 'Equity in Tech',
			subtitle: 'NextSteps & Scholarships',
			href: `${base}/about#equity-in-tech`,
		},
	];
}

export const EXTERNAL_ENGAGEMENT: EngagementItem[] = [
	{
		title: 'AImpact',
		role: 'Head of AI & CEO',
		desc: '80+ AI workshops to 10K+ professionals — 40% avg productivity lift',
	},
	{
		title: 'Microsoft Azure OpenAI Bootcamps',
		role: 'Lead Architect',
		desc: 'Contracted by Microsoft to lead Azure OpenAI bootcamps — 30% lift in cert pass-rates',
	},
	{
		title: 'Google + Dream Machine Innovation Labs',
		role: 'Curriculum Author & Headliner',
		desc: 'AI Library Project — five-city GenAI training tour for underserved communities',
	},
	{
		title: 'NextSteps DevCon',
		role: 'Founder',
		desc: 'Engineering conference and Pledge to Equality scholarships (10K+ awards)',
	},
];

export const QUICK_NAV_ITEMS: QuickNavItem[] = [
	{
		href: '#case-studies',
		title: 'Featured Work',
		description: 'AI products and ventures shipped to real customers',
	},
	{
		href: '#insights',
		title: 'Writing & Insights',
		description: 'Notes on Generative AI, voice, and the future of work',
	},
];

export function getQuickNavItems(): QuickNavItem[] {
	const base = getBasePath();
	return [
		{
			href: '#case-studies',
			title: 'Featured Work',
			description: 'AI products and ventures shipped to real customers',
		},
		{
			href: `${base}/experience`,
			title: 'Career & Ventures',
			description: 'A decade building AI products, companies, and communities',
		},
		{
			href: '#insights',
			title: 'Writing & Insights',
			description: 'Notes on Generative AI, voice, and the future of work',
		},
	];
}
