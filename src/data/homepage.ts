/**
 * Homepage content data
 */

import type {
	StatItem,
	PhilosophyCardData,
	FocusAreaPreview,
	EngagementItem,
	QuickNavItem,
	ProofMetric,
	PhilosophyStep,
	IntentCard,
	HomeProofMetric,
	HomePhilosophyStep,
	HomePathCard,
	HomeNumberCard,
	HomeKeynoteCard,
	HomeEventPreview,
	HomeWritingPreview,
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
	const base = '';
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

/** Build → Learn → Teach → Inspire — 4-step philosophy strip */
export const PHILOSOPHY_STEPS: PhilosophyStep[] = [
	{
		step: 'Build',
		icon: '⚙️',
		description: 'Ship real things. I build AI systems in production — not demos — because the constraint of real stakes forces clarity.',
	},
	{
		step: 'Learn',
		icon: '🧠',
		description: 'Extract the lessons. Every build surfaces things you can\'t read in a blog post. What broke? What surprised you? That\'s the real curriculum.',
	},
	{
		step: 'Teach',
		icon: '🎙️',
		description: 'Multiply the impact. I teach what I\'ve built in a way that creates Aha! moments — so others can start where I finished, not where I started.',
	},
	{
		step: 'Inspire',
		icon: '⚡',
		description: 'Make the world bigger. The goal isn\'t to transfer knowledge — it\'s to show people what\'s possible so they go build their own thing.',
	},
];

/** 10 industries for homepage industry selector */
export const INDUSTRIES: string[] = [
	'Healthcare',
	'Financial Services',
	'Legal',
	'Real Estate',
	'Education',
	'Retail',
	'Government',
	'Non-Profit',
	'Insurance',
	'Media & Entertainment',
];

/** 4-metric credibility grid for homepage */
export const CREDIBILITY_METRICS: ProofMetric[] = [
	{ value: '10+', label: 'Years Enterprise AI Leadership', highlight: false },
	{ value: '80+', label: 'Workshops Delivered', highlight: true },
	{ value: '10', label: 'Industries Served', highlight: false },
	{ value: '10K+', label: 'Professionals Trained', highlight: false },
];

/** "What brings you here?" intent cards */
export const INTENT_CARDS: IntentCard[] = [
	{
		icon: '🎤',
		title: 'Book a Keynote',
		description: 'Premium AI keynotes for conferences, summits, and company events.',
		href: '/speaking',
	},
	{
		icon: '🏗️',
		title: 'Register for a Workshop',
		description: 'Hands-on AI training from fundamentals to executive strategy.',
		href: '/workshops',
	},
	{
		icon: '🏭',
		title: 'Explore AI for My Industry',
		description: 'See how AI is transforming your specific sector.',
		href: '/speaking?view=industries',
	},
	{
		icon: '📚',
		title: 'Learn AI',
		description: 'Dive into the AI Lab — experiments, tools, prompts, and lessons.',
		href: '/ai-lab',
	},
	{
		icon: '🔍',
		title: 'Discover the Work',
		description: 'Case studies and projects built in production.',
		href: '/projects',
	},
];

export function getQuickNavItems(): QuickNavItem[] {
	const base = '';
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

export const proofMetrics: HomeProofMetric[] = [
	{ value: '10+', label: 'Years in GenAI' },
	{ value: '10K+', label: 'Scholarships', highlight: true },
	{ value: '80+', label: 'Workshops' },
	{ value: '10K+', label: 'Professionals Trained' },
	{ value: '5+', label: 'Ventures' },
];

export const philosophySteps: HomePhilosophyStep[] = [
	{
		index: '01',
		title: 'Build',
		description: 'Ship real systems where constraints are honest and outcomes are measurable.',
	},
	{
		index: '02',
		title: 'Learn',
		description: 'Extract the lesson from production, not from marketing copy.',
	},
	{
		index: '03',
		title: 'Teach',
		description: 'Turn hard-won implementation patterns into practical playbooks.',
	},
	{
		index: '04',
		title: 'Inspire',
		description: 'Raise confidence so teams can move from spectatorship to action.',
	},
];

export const workshopMediaLabels = {
	featuredVideo: 'Video · 02:14 · Workshop keynote reel',
	photoOne: 'Photo · Workshop floor facilitation',
	photoTwo: 'Photo · Live whiteboard strategy session',
	photoThree: 'Photo · Audience breakout collaboration',
};

export const pathCards: HomePathCard[] = [
	{
		index: '01',
		title: 'Book a keynote',
		description: 'High-signal talks grounded in what ships in enterprise AI.',
		href: '/speaking',
	},
	{
		index: '02',
		title: 'Run a workshop',
		description: 'Hands-on sessions that move teams from AI curiosity to execution.',
		href: '/workshop',
	},
	{
		index: '03',
		title: 'Explore your industry',
		description: 'Concrete AI strategy patterns tailored to your sector and constraints.',
		href: '/speaking#industries',
	},
	{
		index: '04',
		title: 'Read the playbook',
		description: 'Essays and field notes on what works, what fails, and why.',
		href: '/writing',
	},
];

export const numberCards: HomeNumberCard[] = [
	{ value: '10+', label: 'Years in applied AI leadership' },
	{ value: '80+', label: 'Workshops delivered globally' },
	{ value: '10', label: 'Industries served' },
	{ value: '10K+', label: 'Professionals trained' },
];

export const industries: string[] = [
	'Healthcare',
	'Financial Services',
	'Legal',
	'Real Estate',
	'Education',
	'Retail',
	'Government',
	'Non-Profit',
	'Insurance',
	'Media & Entertainment',
];

export const keynoteCards: HomeKeynoteCard[] = [
	{
		tier: 'Signature',
		duration: '30-45 min',
		title: 'Voice AI in production',
		abstract:
			'What it takes to deploy voice systems that perform under real operational pressure, from architecture choices to failure handling.',
		audience: ['Founders', 'Product leaders', 'AI engineers'],
	},
	{
		tier: 'Signature',
		duration: '30-45 min',
		title: 'AI without fear',
		abstract:
			'A practical framework for helping teams replace uncertainty with confident experimentation and measurable adoption.',
		audience: ['Executives', 'Team leads', 'Operators'],
	},
];

export const eventPreviews: HomeEventPreview[] = [
	{
		date: 'Sep 18, 2026',
		title: 'AI Strategy Forum Keynote',
		venue: 'Washington, DC',
	},
	{
		date: 'Oct 03, 2026',
		title: 'Applied AI Leadership Summit',
		venue: 'Atlanta, GA',
	},
];

export const writingPreviews: HomeWritingPreview[] = [
	{
		date: 'May 2026',
		title: 'What ships in enterprise AI',
		description: 'How to separate promising demos from systems that can survive operations.',
		href: '/writing/what-ships-in-enterprise-ai',
	},
	{
		date: 'Apr 2026',
		title: 'Designing voice agents for trust',
		description: 'Patterns for escalation, guardrails, and handoff that keep people in control.',
		href: '/writing/designing-voice-agents-for-trust',
	},
	{
		date: 'Mar 2026',
		title: 'The build-learn-teach flywheel',
		description: 'Why operators who teach compound faster than teams that only consume content.',
		href: '/writing/the-build-learn-teach-flywheel',
	},
];
