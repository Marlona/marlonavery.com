/**
 * Site-wide configuration - Single source of truth for personal info and settings
 */

export const SITE_CONFIG = {
	name: "Marlon Avery",
	shortName: "Marlon Avery",
	title: "VP of Applied AI Lead | Generative AI Builder & Educator",
	email: "hi@marlonavery.com",
	description: "Marlon Avery is a generative AI leader building voice and agentic systems that automate operations and elevate customer experience. VP of Applied AI Lead at JPMorgan Chase, Founder & CEO of VoicePath, Head of AI at AImpact (Microsoft Azure OpenAI bootcamps + Google AI Library Project). Based in Washington, DC.",

	githubUsername: "Marlona",
	linkedInUsername: "marlon-avery-42751a60",
	twitterHandle: "IamMarlonAvery",

	currentCompany: "JPMorgan Chase",
	currentRole: "VP, Applied AI Lead",

	availableForHire: true,

	googleSiteVerification: '',
} as const;

export const SOCIAL_LINKS = {
	github: `https://github.com/${SITE_CONFIG.githubUsername}`,
	linkedin: `https://linkedin.com/in/${SITE_CONFIG.linkedInUsername}`,
	twitter: `https://twitter.com/${SITE_CONFIG.twitterHandle}`,
	email: `mailto:${SITE_CONFIG.email}`,
} as const;

export const NAV_LINKS = [
	{ href: '/about', label: 'About' },
	{ href: '/speaking', label: 'Speaking' },
	{ href: '/workshops', label: 'Workshops' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/events', label: 'Events' },
	{ href: '/ai-lab', label: 'AI Lab' },
	{ href: '/playbook', label: 'Playbook' },
	{ href: '/writing', label: 'Writing' },
	{ href: '/contact', label: 'Contact' },
] as const;

export const RESUME_PATH = '/Marlon_Avery_Resume.pdf';
