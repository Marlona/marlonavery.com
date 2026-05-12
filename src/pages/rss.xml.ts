import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../config';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog', ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sortedPosts = posts.sort(
		(a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
	);

	return rss({
		title: `${SITE_CONFIG.name} - Technical Insights`,
		description: SITE_CONFIG.description,
		site: context.site || 'https://marlonavery.com',
		items: sortedPosts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.publishDate,
			description: post.data.description,
			link: `/blog/${post.id}/`,
			categories: post.data.tags,
		})),
		customData: `<language>en-us</language>`,
	});
}
