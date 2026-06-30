/**
 * Events page data (static config only — event data lives in the events content collection)
 */

export const EVENTS_HERO = {
	headline: 'On Stage and In the Room',
	subhead: 'Keynotes, workshops, panels, and live sessions — catch Marlon live or explore the archive.',
};

export const EVENTS_TABS = [
	{ id: 'upcoming', label: 'Upcoming' },
	{ id: 'past', label: 'Archive' },
];

export const EVENT_TYPE_LABELS: Record<string, string> = {
	keynote: 'Keynote',
	workshop: 'Workshop',
	panel: 'Panel',
	conference: 'Conference',
	podcast: 'Podcast',
	live: 'Live Session',
};
