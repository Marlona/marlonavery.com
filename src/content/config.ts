import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. BLOG COLLECTION
const blog = defineCollection({
    loader: glob({ pattern: ['**/*.{md,mdx}', '!**/CLAUDE.md'], base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        publishDate: z.coerce.date(),
        description: z.string().max(200, "Keep descriptions short for SEO"),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        readingTime: z.number().optional(), // In minutes
        canonicalUrl: z.string().url().optional(),
        heroImage: z.string().optional(),
        repository: z.string().url().optional(),
    }),
});

// 2. PROJECTS COLLECTION
const projects = defineCollection({
    loader: glob({ pattern: ['**/*.{md,mdx}', '!**/CLAUDE.md'], base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        slug: z.string().optional(), // Optional because filename can be slug
        publishDate: z.coerce.date(),
        description: z.string(),
        category: z.enum(['strategic', 'open-source']).default('strategic'),

        // Role & Context
        role: z.string().default("Principal Engineer"),
        organization: z.string(),
        impactSummary: z.string().describe("1-3 sentence high-level impact statement"),

        // Infra/Scale Specifics
        scale: z.union([z.string(), z.array(z.string())]).optional().describe("e.g. '1B+ requests/day', '500+ nodes'"),
        primaryTech: z.array(z.string()).describe("Key tech stack used"),

        // Detailed Lists
        contributions: z.array(z.string()).default([]),
        outcomes: z.array(z.string()).default([]).describe("Measurable results: cost, latency, reliability"),

        // Metadata
        featured: z.boolean().default(false),
        confidential: z.boolean().default(false).describe("Hide unless availableForHire is true - for current employer projects"),
        tags: z.array(z.string()).default([]),
        repository: z.string().url().optional(),
        externalLink: z.string().url().optional(),
        duration: z.string().optional().describe("e.g. '2023-01 to 2023-10'"),

        // Media
        heroImage: z.string().optional(),

        // Auto-generation metadata
        generated: z.boolean().default(false),
        generatedAt: z.coerce.date().optional(),

        // Decision Card - Structured summary of project thinking (NEW)
        decisionCard: z.object({
            problem: z.string().describe("2-3 sentences describing the challenge"),
            constraints: z.array(z.string()).describe("Bullet list of limiting factors"),
            tradeoffs: z.array(z.object({
                option: z.string(),
                pros: z.array(z.string()),
                cons: z.array(z.string()),
                chosen: z.boolean(),
            })).optional().describe("Options considered with pros/cons"),
            artifact: z.object({
                type: z.enum(['doc', 'code', 'diagram', 'dashboard']),
                title: z.string(),
                url: z.string().optional(),
                preview: z.string().optional().describe("Image path for thumbnail"),
            }).optional().describe("Link to real artifact proving the work"),
        }).optional(),
    }),
});

// 3. EXPERIENCE COLLECTION
// Recommendation: Keep as JSON/YAML for structured data usage (timelines, filtering).
const experience = defineCollection({
    loader: glob({ pattern: '**/*.{yaml,json}', base: "./src/content/experience" }),
    schema: z.object({
        company: z.string(),
        role: z.string(),
        level: z.string().optional().describe("e.g. 'Senior Staff', 'Director'"),
        location: z.string(),

        startDate: z.coerce.date(),
        endDate: z.coerce.date().nullable().optional(), // null = Present

        description: z.string().describe("Short summary of the role"),
        achievements: z.array(z.string()).default([]),
        skills: z.array(z.string()).default([]).describe("Tech and leadership skills used"),
        domainTags: z.array(z.string()).default([]).describe("e.g. 'Networking', 'AI Infra'"),
    }),
});

// 4. NARRATIVES COLLECTION
// Rich narrative content linked to experience entries via experienceSlug
const narratives = defineCollection({
    loader: glob({ pattern: ['**/*.{md,mdx}'], base: "./src/content/narratives" }),
    schema: z.object({
        experienceSlug: z.string().describe("Links to experience JSON filename (without extension)"),
        title: z.string().optional(),
        lastUpdated: z.coerce.date().optional(),

        communication: z.object({
            summary: z.string(),
            highlights: z.array(z.string()).default([]),
        }).optional(),

        behavior: z.object({
            summary: z.string(),
            highlights: z.array(z.string()).default([]),
        }).optional(),

        impact: z.object({
            summary: z.string(),
            metrics: z.array(z.object({
                value: z.string(),
                label: z.string(),
                context: z.string().optional(),
            })).default([]),
        }).optional(),
    }),
});

// 5. ARTIFACTS COLLECTION (NEW)
// Curated evidence gallery proving specific claims - links to case studies
const artifacts = defineCollection({
    loader: glob({ pattern: '**/*.json', base: "./src/content/artifacts" }),
    schema: z.object({
        type: z.enum(['design', 'decision', 'ops', 'code', 'proof', 'diagram']).describe("Receipt taxonomy for categorization"),
        title: z.string(),
        thumbnail: z.string().describe("Path to thumbnail image"),
        projectSlug: z.string().describe("REQUIRED: links to case study slug - no orphan artifacts"),
        claim: z.string().describe("What this receipt proves (2-3 sentences)"),
        fullImage: z.string().optional().describe("Higher-res image for detail view"),
    }),
});

// 6. PRESS COLLECTION (NEW)
// Press kit content - bios, photos, talk topics
const press = defineCollection({
    loader: glob({ pattern: '**/*.json', base: "./src/content/press" }),
    schema: z.object({
        bios: z.array(z.object({
            label: z.string(),
            content: z.string(),
            wordCount: z.number(),
        })).optional(),
        photos: z.array(z.object({
            label: z.string(),
            thumbnail: z.string(),
            fullRes: z.string(),
            dimensions: z.string(),
        })).optional(),
        topics: z.array(z.object({
            title: z.string(),
            abstract: z.string(),
            duration: z.string(),
            audience: z.array(z.string()),
            previouslyGiven: z.array(z.string()).optional(),
        })).optional(),
    }),
});

// 7. WORKSHOPS COLLECTION
const workshops = defineCollection({
    loader: glob({ pattern: '**/*.{json,md,mdx}', base: './src/content/workshops' }),
    schema: z.object({
        title: z.string(),
        tagline: z.string(),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'executive']),
        format: z.enum(['virtual', 'in-person', 'hybrid']),
        duration: z.string(),
        audience: z.array(z.string()),
        outcomes: z.array(z.string()).default([]),
        industries: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        enrollUrl: z.string().optional(),
        capacity: z.string().optional(),
    }),
});

// 8. EVENTS COLLECTION
const events = defineCollection({
    loader: glob({ pattern: '**/*.{json,md,mdx}', base: './src/content/events' }),
    schema: z.object({
        title: z.string(),
        slug: z.string().optional(),
        date: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        type: z.enum(['keynote', 'workshop', 'panel', 'conference', 'podcast', 'live']),
        status: z.enum(['upcoming', 'past']),
        venue: z.string().optional(),
        city: z.string().optional(),
        description: z.string(),
        recap: z.string().optional(),
        photos: z.array(z.string()).default([]),
        videoUrl: z.string().url().optional(),
        resources: z.array(z.object({
            label: z.string(),
            url: z.string().url(),
        })).default([]),
        featured: z.boolean().default(false),
    }),
});

// 9. AILAB COLLECTION
const ailab = defineCollection({
    loader: glob({ pattern: '**/*.{json,md,mdx}', base: './src/content/ailab' }),
    schema: z.object({
        title: z.string(),
        publishDate: z.coerce.date(),
        kind: z.enum(['experiment', 'tool', 'prompt', 'lesson']),
        status: z.enum(['active', 'archived', 'in-progress']).default('active'),
        description: z.string(),
        embed: z.string().url().optional(),
        tags: z.array(z.string()).default([]),
        distributedTo: z.array(z.enum(['tiktok', 'instagram', 'linkedin', 'youtube'])).default([]),
        featured: z.boolean().default(false),
    }),
});

// 10. PLAYBOOK COLLECTION
const playbook = defineCollection({
    loader: glob({ pattern: '**/*.json', base: './src/content/playbook' }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        tagline: z.string(),
        summary: z.string(),
        pillars: z.array(z.object({
            name: z.string(),
            description: z.string(),
        })),
        keyQuestions: z.array(z.string()).default([]),
        exampleInPractice: z.string().optional(),
        status: z.enum(['published', 'draft']).default('published'),
        order: z.number().default(0),
    }),
});

export const collections = { blog, projects, experience, narratives, artifacts, press, workshops, events, ailab, playbook };
