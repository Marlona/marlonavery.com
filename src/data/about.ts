/**
 * About page content data
 */

import type {
	PhilosophyCardData,
	FocusAreaFull,
	EngagementSection,
	CompetencyGroup,
	EducationItem,
	CommunityItem,
} from './types';

export const LEADERSHIP_PRINCIPLES: PhilosophyCardData[] = [
	{
		title: 'Operator, Not Spectator',
		description:
			'Strategy without keyboard time produces decks. I lead from inside the work — building, shipping, and iterating alongside the team.',
		icon: '⚡',
	},
	{
		title: 'Reduce the Fear',
		description:
			'Most resistance to AI is anxiety in disguise. Demystification is leverage — for teams, customers, and entire industries.',
		icon: '🌱',
	},
	{
		title: 'Voice as the New UI',
		description:
			'The most natural interface humans have is conversation. The next decade of software will sound, not just look.',
		icon: '🎙️',
	},
	{
		title: 'Equity by Design',
		description:
			'Access compounds, and so does its absence. Through NextSteps DevCon and Pledge to Equality, I build pipelines that widen who gets to build the future.',
		icon: '🤝',
	},
	{
		title: 'Predict the Curve',
		description:
			'Generative AI moves on a quarterly cadence. I build for what is true 18 months from now, not just what shipped last week.',
		icon: '🔭',
	},
];

export const STRATEGIC_APPROACH: PhilosophyCardData[] = [
	{
		title: 'AI for Real Work',
		description:
			'Demos are easy. Production is the bar. Every product I ship answers a real operator question, not a research question.',
		icon: '📊',
	},
	{
		title: 'Founder Discipline',
		description:
			'VoicePath, AImpact, NextSteps DevCon — multiple ventures running in parallel teaches you what to delegate and what to own.',
		icon: '🛠️',
	},
	{
		title: 'Teach What You Build',
		description:
			'Workshops, talks, and writing turn lessons into leverage. 10,000+ AImpact attendees later, teaching is how I keep my own thinking honest.',
		icon: '📚',
	},
	{
		title: 'Bias Toward Voice',
		description:
			'Conversational interfaces are leaving text behind. I bet the next wave of consumer and enterprise AI will be heard before it is read.',
		icon: '🎧',
	},
];

export const FOCUS_AREAS: FocusAreaFull[] = [
	{
		id: 'voice-ai',
		title: 'Voice AI for Business Operations',
		summary:
			'Conversational agents that replace fragile IVRs, overworked receptionists, and high-friction call flows with natural, grounded conversation.',
		details: [
			'AI Receptionists for healthcare, legal, and SMBs',
			'AI Call Centers for high-volume customer interactions',
			'STT, LLM reasoning, RAG grounding, and natural TTS pipelines',
			'Escalation patterns that make human handoff a feature, not a fallback',
		],
		metrics: 'First-contact resolution, missed-call recovery, customer satisfaction',
	},
	{
		id: 'ai-agents',
		title: 'AI Agents & Workflow Automation',
		summary:
			'Long-running agents that complete real work — scheduling, document QA, research, and operational tasks — across business surfaces.',
		details: [
			'Agent design patterns: planner, executor, critic',
			'Tool use and integration with CRM, calendar, and document stacks',
			'Safety and escalation patterns for production agents',
			'Cost and latency tuning for always-on workflows',
		],
		metrics: 'Tasks completed, escalation rate, cost per resolution',
	},
	{
		id: 'applied-llms',
		title: 'Applied LLMs',
		summary:
			'Productized GPT and Claude workflows that solve concrete business problems — document QA, content generation, research summarization, curriculum design.',
		details: [
			'AI-Enhanced Document Chatbot (GPT-4 + vector DB)',
			'AI News Bot for marketers and analysts',
			'AI-Generated Curriculum Creator for educators',
			'Prompt and retrieval architecture for high-trust use cases',
		],
		metrics: 'Time saved per workflow, accuracy on grounded answers, adoption',
	},
	{
		id: 'ai-education',
		title: 'AI Education & Workforce Enablement',
		summary:
			'Workshops, talks, and curricula that turn AI anxiety into AI capability — for executives, operators, educators, and creatives.',
		details: [
			'AImpact: 80+ workshops to 10,000+ professionals — 40% avg productivity lift',
			'Microsoft-contracted Azure OpenAI bootcamps — 30% lift in cert pass-rates',
			'Google + Dream Machine AI Library Project five-city tour',
			'Curriculum spanning prompt engineering, agents, OCR-LLM pipelines, and voice AI',
		],
		metrics: 'Attendees trained, certification pass-rate lift, corporate engagements',
	},
	{
		id: 'equity-in-tech',
		title: 'Equity in Tech',
		summary:
			'Programs and platforms that widen access to engineering education and AI — built so the next generation of builders looks more like the world they are building for.',
		details: [
			'NextSteps DevCon: conference and mentorship community',
			'Pledge to Equality Scholarship Program (10K+ awards)',
			'Pipeline programs for underserved technologists',
			'Speaking and advocacy on inclusive AI futures',
		],
		metrics: 'Scholarships granted, attendee outcomes, sponsor partnerships',
	},
];

export const EXTERNAL_ENGAGEMENT: Record<string, EngagementSection> = {
	speaking: {
		title: 'Speaking & Thought Leadership',
		items: [
			'Keynotes alongside leaders from Google, IBM, and Microsoft',
			'AImpact: 80+ workshops to 10K+ professionals worldwide',
			'Microsoft-contracted Azure OpenAI bootcamps',
			'Google + Dream Machine AI Library Project tour',
		],
	},
	community: {
		title: 'Community & Education',
		items: [
			'Founder of NextSteps DevCon',
			'Pledge to Equality Scholarship Program (10K+ awards)',
			'Mentorship for emerging engineers and founders',
		],
	},
	dei: {
		title: 'Equity Advocacy',
		items: [
			'Pipeline programs for underserved communities',
			'Inclusive AI and product practices',
			'Speaking on equity in the AI era',
		],
	},
};

export const COMPETENCY_GROUPS: CompetencyGroup[] = [
	{
		title: 'Generative AI',
		skills: [
			'OpenAI GPT-4o',
			'Anthropic Claude',
			'Azure OpenAI',
			'LangChain & RAG',
			'OCR & Document Intelligence',
			'Vector DBs (Pinecone, Chroma)',
			'Prompt Engineering',
			'LLMOps / MLOps',
		],
	},
	{
		title: 'Voice & Conversational AI',
		skills: [
			'STT (Whisper)',
			'TTS (ElevenLabs)',
			'Twilio Voice / Telephony',
			'Conversation Design',
			'HIPAA-Compliant Voice Pipelines',
			'Veradigm EHR Integration',
		],
	},
	{
		title: 'Product & Engineering',
		skills: [
			'Python',
			'TypeScript / JavaScript',
			'Cloud (Azure, GCP)',
			'Web & Mobile Product',
			'CI/CD & Release Management',
			'Founder Operations',
		],
	},
	{
		title: 'Leadership & Education',
		skills: [
			'Applied AI Strategy',
			'Technical Program Management',
			'Workshop & Curriculum Design',
			'Public Speaking',
			'Mentorship & DEI',
			'Certified ScrumMaster (CSM)',
		],
	},
];

export const EDUCATION: EducationItem[] = [
	{
		school: 'University of Oxford',
		degree: 'Artificial Intelligence: Cloud and Edge Implementations',
		years: '2022',
	},
	{
		school: 'Scrum Alliance',
		degree: 'Certified ScrumMaster (CSM)',
		years: '2022',
	},
];

export const COMMUNITY: CommunityItem[] = [
	{
		role: 'Head of AI & CEO',
		org: 'AImpact',
		desc: '80+ AI workshops delivered globally to more than 10,000 professionals, demystifying Generative AI for businesses and underserved communities. Microsoft Azure OpenAI bootcamp lead and Google + Dream Machine AI Library Project headliner.',
	},
	{
		role: 'Founder',
		org: 'NextSteps DevCon',
		desc: 'Engineering conference and community for emerging developers, paired with the Pledge to Equality Scholarship Program (10K+ awards).',
	},
	{
		role: 'Co-host',
		org: 'AI With Friends',
		desc: 'Weekly conversations on the latest in Generative AI, agents, voice, and the future of work.',
	},
];
