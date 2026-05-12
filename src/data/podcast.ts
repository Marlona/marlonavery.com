/**
 * AI with Friends Podcast Data
 * Weekly podcast on AI, engineering, and tech culture
 */

export const PODCAST_INFO = {
	name: 'AI With Friends',
	tagline: 'Your weekly launchpad into the world of Artificial Intelligence',
	description: 'Three industry experts bring together GenAI innovation strategy, engineering leadership, and cloud systems expertise to make AI insights accessible, actionable, and exciting.',
	schedule: 'Live on LinkedIn every Wednesday at 10:00 AM ET',
	role: 'Co-host',
} as const;

export const PODCAST_LINKS = {
	apple: 'https://podcasts.apple.com/us/podcast/ai-with-friends/id1766625661',
	spotify: 'https://open.spotify.com/show/6pcHPOBD8bvE9V0Hxes9sr',
	youtube: 'https://www.youtube.com/@AIWithFriendsPodcast',
	linkedin: 'https://linkedin.com/company/aiwithfriendspodcast',
	instagram: 'https://instagram.com/aiwithfriendspodcast',
} as const;

export const PODCAST_HOSTS = [
	{
		name: 'Marlon Avery',
		title: 'GenAI Innovation Strategist',
		description: 'Pioneer in GenAI innovation with collaborations with tech giants',
	},
	{
		name: 'Adrian Green',
		title: 'VP of Engineering, LiveNation',
		description: 'Global entertainment engineering leader',
	},
] as const;

// Recent episodes - update periodically
export const RECENT_EPISODES = [
	{
		title: 'GPT-5 Reality Check, Perplexity\'s $34.5B Chrome Bid, and GitHub\'s AI Leadership Shakeup',
		season: 2,
		episode: 13,
		date: '2025-08-13',
		duration: '1h 57m',
		description: 'Mixed reactions to GPT-5, OpenAI\'s missed opportunities in AI coding, GitHub CEO departure.',
		topics: ['GPT-5', 'Perplexity', 'GitHub', 'AI Coding'],
	},
	{
		title: 'Teen AI Companions, Claude\'s Usage Limits, and OpenAI\'s 2.5 Billion Daily Prompts',
		season: 2,
		episode: 11,
		date: '2025-08-13',
		duration: '1h 31m',
		description: '72% of US teens using AI companions, Claude\'s usage restrictions, infrastructure scaling.',
		topics: ['AI Companions', 'Claude', 'OpenAI', 'Infrastructure'],
	},
	{
		title: 'The $10 Billion AI Arms Race - XAI, Oracle\'s Rise, and the End of Free Data',
		date: '2025-07-28',
		duration: '1h 28m',
		description: 'Elon Musk\'s $10B XAI funding, Oracle as emerging cloud provider, AI training data accessibility.',
		topics: ['XAI', 'Oracle', 'AI Funding', 'Training Data'],
	},
	{
		title: 'SEO is Dead, Long Live GEO - The Future of Search & 50% of Jobs at Risk',
		date: '2025-07-24',
		duration: '1h 53m',
		description: 'Andreessen Horowitz\'s Generative Engine Optimization framework, job market implications.',
		topics: ['GEO', 'SEO', 'AI Search', 'Future of Work'],
	},
	{
		title: '"AI Love Island" - The Windsurf Drama, Vibe Coding, and 9,000 Jobs Gone',
		date: '2025-07-23',
		duration: '1h 39m',
		description: 'AI startup acquisition saga, AI coding tool limitations, Microsoft\'s automation job cuts.',
		topics: ['Windsurf', 'Vibe Coding', 'AI Jobs', 'Microsoft'],
	},
	{
		title: 'Replit\'s Bold Claims, Google\'s Veo 3, and the Future of AI Coding',
		date: '2025-07-22',
		duration: '1h 56m',
		description: 'Testing Google\'s video generation tool, Replit CEO controversies, AI agent capabilities.',
		topics: ['Replit', 'Google Veo', 'AI Coding', 'AI Agents'],
	},
] as const;

export const TOTAL_EPISODES = 24;
