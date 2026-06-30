/**
 * AI Lab page data
 */
import type { LabChannel } from './types';

export const LAB_MISSION = 'The AI Lab is my public innovation journal — a record of what I\'m building, testing, and learning. Every experiment here is real. Every tool was built or prompted for a real purpose. And every lesson came from something that didn\'t work the way I expected. This is where Build → Learn → Teach starts.';

export const LAB_DISTRIBUTION_CHANNELS: LabChannel[] = [
	{
		platform: 'linkedin',
		handle: 'linkedin.com/in/marlon-avery-42751a60',
		description: 'Deep dives and professional insights',
	},
	{
		platform: 'youtube',
		handle: '@IamMarlonAvery',
		description: 'Video walkthroughs and tutorials',
	},
	{
		platform: 'instagram',
		handle: '@IamMarlonAvery',
		description: 'Quick tips and visual breakdowns',
	},
	{
		platform: 'tiktok',
		handle: '@IamMarlonAvery',
		description: 'Short-form AI explainers',
	},
];

export const LAB_KIND_LABELS: Record<string, string> = {
	experiment: 'Experiment',
	tool: 'Tool',
	prompt: 'Prompt',
	lesson: 'Lesson',
};

export const LAB_FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'experiment', label: 'Experiments' },
	{ id: 'tool', label: 'Tools' },
	{ id: 'prompt', label: 'Prompts' },
	{ id: 'lesson', label: 'Lessons' },
];
