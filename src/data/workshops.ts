/**
 * Workshops page and enrollment wizard data
 */
import type { WizardStep } from './types';

export const AIMPACT_OVERVIEW = {
	tagline: 'AI education that creates Aha! moments',
	description: 'AImpact workshops go beyond theory to hands-on AI capability. Whether you\'re a complete beginner or a seasoned professional, every session is designed to meet you where you are and leave you with something you can actually use.',
	stats: [
		{ value: '80+', label: 'Workshops Delivered' },
		{ value: '10K+', label: 'Professionals Trained' },
		{ value: '40%', label: 'Avg Productivity Lift' },
		{ value: '10', label: 'Industries Served' },
	],
};

export const WORKSHOP_LEVELS = [
	{ id: 'all', label: 'All Levels', color: 'default' },
	{ id: 'beginner', label: 'Beginner', color: 'soft' },
	{ id: 'intermediate', label: 'Intermediate', color: 'coral' },
	{ id: 'advanced', label: 'Advanced', color: 'deep' },
	{ id: 'executive', label: 'Executive', color: 'slate' },
];

export const WORKSHOP_FORMATS = [
	{ id: 'all', label: 'All Formats' },
	{ id: 'virtual', label: 'Virtual' },
	{ id: 'in-person', label: 'In-Person' },
	{ id: 'hybrid', label: 'Hybrid' },
];

export const ENROLLMENT_STEPS: WizardStep[] = [
	{
		id: 'who-are-you',
		title: 'Tell us about yourself',
		question: 'Who are you?',
		options: [
			{ id: 'professional', label: 'Business Professional', icon: '💼', description: 'I work in a company and want to use AI in my role' },
			{ id: 'student', label: 'Student or Early Career', icon: '📚', description: 'I\'m building skills for the future of work' },
			{ id: 'executive', label: 'Executive or Leader', icon: '🏛️', description: 'I lead teams and need an AI strategy' },
			{ id: 'educator', label: 'Educator or Trainer', icon: '🎓', description: 'I teach others and want to bring AI into my practice' },
		],
	},
	{
		id: 'what-brings-you',
		title: 'Your goal',
		question: 'What brings you here?',
		options: [
			{ id: 'build-tools', label: 'Build AI Tools', icon: '⚙️', description: 'I want to actually create AI-powered products or assistants' },
			{ id: 'upskill-team', label: 'Upskill My Team', icon: '👥', description: 'I want to bring AI capability to the people I work with' },
			{ id: 'ai-leadership', label: 'Lead AI Strategy', icon: '🗺️', description: 'I need an AI roadmap and adoption framework for my organization' },
			{ id: 'learn-fundamentals', label: 'Learn the Fundamentals', icon: '🧠', description: 'I want to understand what AI actually is and how it works' },
			{ id: 'explore-industry', label: 'Explore AI for My Industry', icon: '🏭', description: 'I want to see how AI applies specifically to my sector' },
		],
	},
	{
		id: 'comfort-level',
		title: 'Your AI comfort level',
		question: 'How comfortable are you with AI today?',
		options: [
			{ id: 'beginner', label: 'Complete Beginner', icon: '🌱', description: 'I\'ve heard of ChatGPT but haven\'t really used AI tools' },
			{ id: 'some-exposure', label: 'Some Exposure', icon: '🌿', description: 'I\'ve used ChatGPT a few times but don\'t use it regularly' },
			{ id: 'working-knowledge', label: 'Working Knowledge', icon: '🌳', description: 'I use AI tools regularly and want to go deeper' },
			{ id: 'advanced', label: 'Advanced', icon: '🚀', description: 'I build with AI and want to level up my technical skills' },
		],
	},
	{
		id: 'excitement',
		title: 'What excites you',
		question: 'What excites you most about AI?',
		multiSelect: true,
		options: [
			{ id: 'voice-ai', label: 'Voice AI', icon: '🎤', description: 'Agents that listen, respond, and act through conversation' },
			{ id: 'ai-agents', label: 'AI Agents', icon: '🤖', description: 'Systems that complete complex tasks autonomously' },
			{ id: 'document-intelligence', label: 'Document Intelligence', icon: '📄', description: 'AI that reads, summarizes, and extracts insights from documents' },
			{ id: 'prompt-engineering', label: 'Prompt Engineering', icon: '✏️', description: 'The art and science of communicating effectively with AI' },
			{ id: 'ai-strategy', label: 'AI Strategy', icon: '♟️', description: 'Planning and executing AI adoption across an organization' },
		],
	},
];

export const RECOMMENDATION_MAP: Record<string, string> = {
	// Beginner paths → AI Fundamentals
	'professional-learn-fundamentals-beginner': 'ai-fundamentals-for-professionals',
	'student-learn-fundamentals-beginner': 'ai-fundamentals-for-professionals',
	'professional-explore-industry-beginner': 'ai-fundamentals-for-professionals',

	// Intermediate paths → Prompt Engineering Masterclass
	'professional-build-tools-some-exposure': 'prompt-engineering-masterclass',
	'professional-build-tools-working-knowledge': 'prompt-engineering-masterclass',
	'student-build-tools-working-knowledge': 'prompt-engineering-masterclass',

	// Executive paths → AI Strategy for Executives
	'executive-ai-leadership-beginner': 'ai-strategy-for-executives',
	'executive-ai-leadership-some-exposure': 'ai-strategy-for-executives',
	'executive-ai-leadership-working-knowledge': 'ai-strategy-for-executives',
	'executive-upskill-team-some-exposure': 'ai-strategy-for-executives',

	// Default fallback
	'default': 'ai-fundamentals-for-professionals',
};
