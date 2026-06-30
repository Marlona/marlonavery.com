/**
 * Speaking page data
 */
import type { KeynoteTopic, AudienceOutcome, EventPlannerResource, Testimonial } from './types';

export const SPEAKING_HERO = {
	headline: 'The AI Voice That Changes the Room',
	subhead: 'Marlon Avery delivers keynotes and workshops that don\'t just inform — they transform how your audience thinks about and uses AI.',
	ctaBook: 'Book Marlon',
	ctaPressKit: 'Download Press Kit',
	positioningQuote: 'I don\'t talk about AI from a distance. I build it, deploy it, and then teach everything I learned so your audience can do the same.',
};

export const KEYNOTE_TOPICS: KeynoteTopic[] = [
	{
		title: 'Voice AI in Production',
		abstract: 'What it actually takes to ship a voice agent that works in the real world — covering architecture decisions, failure modes, and the gap between demos and production. This talk goes beyond the hype to show what\'s technically required and organizationally challenging when deploying voice AI at scale.',
		duration: '30-45 min',
		audience: ['Founders', 'Product Leaders', 'AI Engineers', 'CTOs'],
		tier: 'signature',
	},
	{
		title: 'AI Without Fear: Building a Culture of Curiosity',
		abstract: 'After training 10,000+ professionals across 80+ workshops, the single biggest predictor of AI adoption isn\'t technical readiness — it\'s psychological safety. This keynote gives leaders a framework for moving teams from fear to capability, with practical tools they can deploy the next day.',
		duration: '30-45 min',
		audience: ['HR Leaders', 'L&D Professionals', 'CEOs', 'Team Managers'],
		tier: 'signature',
	},
	{
		title: 'Equity by Design: Building AI That Works for Everyone',
		abstract: 'AI systems reflect the priorities of the people who build them. This keynote challenges audiences to consider who benefits and who gets left behind — and gives them a practical framework for building AI that is both high-performing and genuinely equitable.',
		duration: '25-40 min',
		audience: ['Executive Teams', 'Product Leaders', 'Policy Makers', 'DEI Leaders'],
		tier: 'standard',
	},
	{
		title: 'The Applied AI Executive: Leading in the Age of Intelligent Systems',
		abstract: 'For senior leaders navigating the AI transition: what separates organizations that thrive from those that stall isn\'t the technology — it\'s leadership clarity. This session gives executives a practical roadmap for AI strategy, adoption, and governance that moves beyond the buzzwords.',
		duration: '45-60 min',
		audience: ['C-Suite', 'Board Members', 'VPs and Directors', 'Senior Leaders'],
		tier: 'signature',
	},
	{
		title: 'Building with Claude: Agentic AI in the Enterprise',
		abstract: 'A technical-forward talk on agentic AI systems — what they are, how they work, and where they create the most value in enterprise environments. Covers real examples from production deployments, with lessons on trust, oversight, and keeping humans in the loop.',
		duration: '30-45 min',
		audience: ['AI Engineers', 'Technical Leaders', 'Product Managers'],
		tier: 'standard',
	},
	{
		title: 'The Build → Learn → Teach Flywheel',
		abstract: 'The philosophy behind everything Marlon does: you don\'t just build AI systems — you extract the lessons and then multiply impact by teaching them. This keynote shows how this flywheel drives innovation at the individual, team, and organizational level.',
		duration: '20-30 min',
		audience: ['All audiences', 'Educators', 'Leaders', 'Practitioners'],
		tier: 'standard',
	},
];

export const AUDIENCE_OUTCOMES: AudienceOutcome[] = [
	{
		icon: '🧠',
		title: 'A New Mental Model',
		outcomes: [
			'Shift from fear of AI to curiosity-driven exploration',
			'Understand where AI creates real value vs. hype',
			'See their own work through an AI-augmented lens',
		],
	},
	{
		icon: '🛠️',
		title: 'Practical Tools',
		outcomes: [
			'Frameworks they can apply to their specific context',
			'Prompting techniques that work in real workflows',
			'A personal AI adoption roadmap to start Monday',
		],
	},
	{
		icon: '⚡',
		title: 'Organizational Momentum',
		outcomes: [
			'Shared vocabulary for AI discussions across teams',
			'Clarity on where to start and what to prioritize',
			'Confidence to experiment without breaking things',
		],
	},
];

export const INDUSTRIES_SERVED: string[] = [
	'Healthcare', 'Financial Services', 'Technology', 'Education',
	'Legal', 'Real Estate', 'Retail', 'Government',
	'Non-Profit', 'Media & Entertainment', 'Manufacturing', 'Insurance',
];

export const TESTIMONIALS_PLACEHOLDER: Testimonial[] = [
	{
		quote: '[PLACEHOLDER — NEEDS REAL TESTIMONIAL]',
		name: '[Speaker Name]',
		title: '[Title]',
		org: '[Organization]',
	},
	{
		quote: '[PLACEHOLDER — NEEDS REAL TESTIMONIAL]',
		name: '[Speaker Name]',
		title: '[Title]',
		org: '[Organization]',
	},
	{
		quote: '[PLACEHOLDER — NEEDS REAL TESTIMONIAL]',
		name: '[Speaker Name]',
		title: '[Title]',
		org: '[Organization]',
	},
];

export const EVENT_PLANNER_RESOURCES: EventPlannerResource[] = [
	{
		label: 'Speaker Bio & Photos',
		description: 'One-liner, short bio, and high-res headshots in multiple formats.',
		href: '/press',
	},
	{
		label: 'Download Press Kit',
		description: 'Full press kit PDF with bios, topics, and speaker information.',
		href: '/Marlon_Avery_Resume.pdf',
		external: true,
	},
	{
		label: 'Request Tech Rider',
		description: 'A/V requirements, stage setup, and equipment needs.',
		href: 'mailto:hi@marlonavery.com?subject=Tech+Rider+Request',
		external: true,
	},
	{
		label: 'Booking Inquiry',
		description: 'For date availability and engagement details.',
		href: '#booking-form',
	},
];
