// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const { PUBLIC_BASE_PATH, SITE } = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: SITE || 'https://marlonavery.com',
  base: PUBLIC_BASE_PATH || '/',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    mdx(),
    sitemap({
      // Customize sitemap entries with priorities and change frequencies
      serialize(item) {
        const url = item.url;
        // Remove trailing slash for easier matching
        const path = url.replace(/\/$/, '');

        // Homepage - highest priority
        if (path === 'https://marlonavery.com' || path.endsWith('/marlonavery')) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        }
        // Main navigation pages - high priority
        else if (path.endsWith('/about') || path.endsWith('/experience') || path.endsWith('/contact')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        }
        // Project and writing index pages
        else if (path.endsWith('/projects') || path.endsWith('/writing')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // Individual project pages - important content
        else if (path.includes('/projects/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        // Individual blog posts
        else if (path.includes('/blog/')) {
          item.priority = 0.6;
          item.changefreq = 'yearly';
        }
        // LLMs text files
        else if (path.endsWith('.txt')) {
          item.priority = 0.4;
          item.changefreq = 'monthly';
        }
        // Default for any other pages
        else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }

        return item;
      },
      // Additional sitemap customization
      customPages: [
        'https://marlonavery.com/llms.txt',
        'https://marlonavery.com/llms-full.txt',
      ],
    })
  ]
});