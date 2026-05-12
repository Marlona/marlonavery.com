/**
 * Contact page content data
 */

export interface EngagementType {
	id: string;
	title: string;
	icon: string;
	description: string;
	examples: string[];
}

export interface FAQItem {
	question: string;
	answer: string;
}

export const ENGAGEMENT_TYPES: EngagementType[] = [
	{
		id: 'speaking',
		title: 'Speaking & Workshops',
		icon: '🎤',
		description:
			'Keynotes, workshops, and corporate training on Generative AI, voice agents, and the practical realities of shipping AI into production.',
		examples: [
			'Conference keynotes and breakout sessions',
			'AImpact-style hands-on workshops',
			'Executive briefings on AI strategy',
			'Podcast and panel appearances',
		],
	},
	{
		id: 'conversations',
		title: 'AI Conversations',
		icon: '💬',
		description:
			'Happy to compare notes with founders, operators, and engineers shipping Generative AI products. No sales pitch, just trading what we have learned.',
		examples: [
			'Voice AI architecture and conversation design',
			'Agent and RAG product patterns',
			'Applied LLM workflows for real businesses',
			'AI strategy in regulated industries',
		],
	},
	{
		id: 'community',
		title: 'Community & Mentorship',
		icon: '🤝',
		description:
			'Open to connecting with emerging technologists — especially those entering AI from underrepresented backgrounds. NextSteps DevCon and AImpact channels are also open.',
		examples: [
			'Mentorship for AI builders and founders',
			'NextSteps DevCon and scholarship inquiries',
			'Inclusive AI community connections',
			'Cross-org learning exchanges',
		],
	},
];

export const CONSULTING_ENGAGEMENTS: EngagementType[] = [
	{
		id: 'voicepath',
		title: 'VoicePath Engagements',
		icon: '🎙️',
		description:
			'Custom voice agents built and deployed for healthcare, finance, insurance, legal, and SMB operations.',
		examples: [
			'AI Receptionists and Call Centers',
			'Voice-first customer journeys',
			'Conversation design and grounding',
			'Production deployment and monitoring',
		],
	},
	{
		id: 'advisory',
		title: 'AI Advisory',
		icon: '🧭',
		description:
			'Strategic guidance for executives and founders on Generative AI roadmap, build-vs-buy, and responsible deployment.',
		examples: [
			'AI roadmap and prioritization',
			'Build-vs-buy and vendor evaluation',
			'Responsible AI and governance',
			'AI literacy across leadership teams',
		],
	},
];

export const HIRING_ENGAGEMENT: EngagementType = CONSULTING_ENGAGEMENTS[0];

export const CONTACT_FAQ_BASE: FAQItem[] = [
	{
		question: 'What topics do you speak on?',
		answer:
			'Voice AI in production, applied LLMs and agents, AI for business operations, AI education and workforce enablement, and equity in the AI era. I tailor each talk to the audience — operators, engineers, executives, or community.',
	},
	{
		question: 'What is the best way to reach you?',
		answer:
			'Email works best for new inquiries. LinkedIn is great for quick introductions or if we have met before. I read everything; responses can take a few days depending on travel and workshop load.',
	},
	{
		question: 'Are you open to coffee chats or informal conversations?',
		answer:
			'Yes. I genuinely enjoy meeting builders, founders, and educators working on Generative AI. If you are shipping something interesting, reach out — no agenda required.',
	},
];

export const CONTACT_FAQ_CONSULTING: FAQItem[] = [
	{
		question: 'What does a VoicePath engagement look like?',
		answer:
			'Discovery, prototype, deploy. We scope your highest-friction voice surface, ship a working agent quickly, and harden it for production. Engagements range from focused 4-week pilots to longer multi-vertical builds.',
	},
	{
		question: 'Do you take on advisory roles?',
		answer:
			'Yes — typically 2–4 hours per month for executives and founders navigating AI strategy, voice product decisions, or responsible deployment. Best discussed live to make sure scope and time commitment align.',
	},
];

export const CONTACT_FAQ: FAQItem[] = CONTACT_FAQ_BASE;

export const CONTACT_INFO = {
	timezone: 'Eastern Time (ET)',
	responseTime: 'Usually within 2-3 business days',
	preferredContact: 'Email for new inquiries, LinkedIn for quick questions',
};
