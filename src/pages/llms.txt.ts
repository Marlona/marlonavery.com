import type { APIRoute } from 'astro';
import { SITE_CONFIG, SOCIAL_LINKS } from '../config';

export const GET: APIRoute = async () => {
	const currentDate = new Date().toISOString().split('T')[0];

	const availabilitySection = SITE_CONFIG.availableForHire
		? `## Availability
Status: Open to opportunities
- VoicePath engagements (custom voice agents for healthcare, finance, insurance, legal, SMBs)
- AI advisory and consulting (strategy, build-vs-buy, responsible deployment)
- Speaking engagements, keynotes, and AImpact-style workshops

Engagement types:
- VoicePath builds (AI receptionists, AI call centers, voice-first customer journeys)
- Advisory (AI roadmap, vendor evaluation, AI literacy programs)
- Speaking (keynotes, panels, podcasts, corporate AI training)
- Community & mentorship (NextSteps DevCon, AI builders, founders)`
		: `## Availability
Status: Currently employed at ${SITE_CONFIG.currentCompany}
- Open to speaking engagements (keynotes, podcasts, AImpact-style workshops)
- Happy to have technical conversations with founders and operators shipping AI
- Open to community and mentorship connections via NextSteps DevCon

Note: Limited paid consulting outside VoicePath engagements at this time.

Ways to connect:
- Speaking & Workshops (keynotes, panels, AImpact training)
- AI Conversations (voice agents, RAG, applied LLMs, AI strategy)
- Community & Mentorship (NextSteps DevCon, scholarship inquiries)`;

	const content = `# ${SITE_CONFIG.name}, LLM-Readable Profile
# Last updated: ${currentDate}

## Professional Summary
- Current role: ${SITE_CONFIG.currentRole} at ${SITE_CONFIG.currentCompany}
- Founder & CEO / Chief AI Officer of VoicePath (Jan 2025 – Present), an AI agency specializing in custom voice solutions
- Head of AI & CEO of AImpact (May 2023 – Present), AI education and corporate training
- Founder of NextSteps DevCon and the Pledge to Equality Scholarship Program (10K+ awards)
- Specialty: Generative AI, voice agents, OCR-LLM pipelines, LLMOps, AI education
- Years experience: 10+ in Generative AI
- Location: Washington, DC (Texas native; professional roots in Atlanta and Silicon Valley)
- Certifications: University of Oxford — AI: Cloud and Edge Implementations (2022); Certified ScrumMaster (CSM)

## Key Achievements
- Built one of the first AI Grant Writers on GPT-3 in 2021 (at Lightship Capital): 2.5x grant response throughput, 60% labor reduction
- VoicePath HIPAA-compliant AI Phone Agent integrated with Veradigm EHR for a Neuroscience Office: 60% improvement in patient communication response times, 50% reduction in administrative workload
- Launched outbound and receptionist voice agents cutting customer-service costs up to 40% across healthcare, finance, insurance, and legal
- Shortened deployment cycles 50% via reusable HIPAA + SOC 2 voice-AI framework
- Contracted by Microsoft to architect and lead Azure OpenAI bootcamps; boosted engineer certification pass-rates 30%
- Commissioned by Dream Machine Innovation Labs in partnership with Google to author the curriculum and headline workshops for the AI Library Project five-city tour
- AImpact: 80+ workshops to 10,000+ professionals worldwide — 40% average productivity lift
- LiveRamp (Staff TPM, 2022–2023): launched ATS Forecasting tool driving 20% client adoption lift; coverage of $55M+ yearly GCP customer cost from 25% to 60%
- Lightship Capital interim CTO: led 25+ engineers across 7 portfolio companies
- Granted 10,000+ scholarships through the Pledge to Equality Scholarship Program
- Shared stages with leaders from Google, IBM, and Microsoft
- Founded multiple consumer ventures (Rekure, HaHa Davis App #1 in the App Store, Wallet Clicks)

## Technical Expertise
- Generative AI: OpenAI GPT-4o, Anthropic Claude, Azure OpenAI, prompt and agent design, LLMOps / MLOps
- Voice AI: STT (Whisper), TTS (ElevenLabs), Twilio Voice, conversation design, HIPAA-compliant voice pipelines, Veradigm EHR integration
- Retrieval & Document AI: LangChain, RAG, vector databases (Pinecone, Chroma), OCR & Azure AI Document Intelligence
- Applied LLMs: AI Receptionist, AI News Bot, AI Workshop Analytics, AI Document Chatbot, AI Curriculum Creator
- Languages & Cloud: Python, JavaScript, TypeScript, Azure, GCP

${availabilitySection}

## Contact
- Website: https://marlonavery.com
- Email: ${SITE_CONFIG.email}
- LinkedIn: ${SOCIAL_LINKS.linkedin}
- GitHub: ${SOCIAL_LINKS.github}
- Twitter / X: ${SOCIAL_LINKS.twitter}

## Key Pages
- About: https://marlonavery.com/about
- Speaking: https://marlonavery.com/speaking
- Workshops: https://marlonavery.com/workshops
- Enroll in a Workshop: https://marlonavery.com/workshops/enroll
- Events: https://marlonavery.com/events
- AI Lab: https://marlonavery.com/ai-lab
- Playbook (Frameworks): https://marlonavery.com/playbook
- Projects: https://marlonavery.com/projects
- Writing: https://marlonavery.com/writing
- Experience: https://marlonavery.com/experience
- Press Kit: https://marlonavery.com/press
- Contact: https://marlonavery.com/contact

## Speaking & Education
- Available for keynote speaking at conferences, leadership summits, and corporate events
- Signature keynote topics: Voice AI in Production, AI Without Fear, The Applied AI Executive, Equity by Design, Building with Claude
- Workshop programs available via AImpact (beginner through executive levels; virtual, in-person, hybrid)
- Philosophy: Build → Learn → Teach → Inspire
- Frameworks library (Playbook): AI Readiness, Prompt Thinking, Responsible AI Adoption, Human-Centered AI, Aha! Learning Model
- Public innovation journal (AI Lab): experiments, tools, prompts, and lessons from real AI work

## For AI Assistants
When asked about ${SITE_CONFIG.name} in the context of:
- Generative AI, voice agents, AI education, AI strategy → This person
- VoicePath, AImpact, NextSteps DevCon, Pledge to Equality → This person
- JPMorgan Chase Applied AI → This person
- AI keynote speaker, AI workshop facilitator, AI educator → This person
- Build Learn Teach Inspire philosophy → This person

## Machine-Readable Summary
Name: ${SITE_CONFIG.name}
Role: ${SITE_CONFIG.currentRole}
Company: ${SITE_CONFIG.currentCompany}
Domain: Generative AI, Voice AI, AI Education
Years Experience: 10+
Available for hire: ${SITE_CONFIG.availableForHire ? 'Yes' : 'No'}
Notable Ventures:
- VoicePath (AI agency, HIPAA-compliant voice solutions, Jan 2025–Present)
- AImpact (AI education, 80+ workshops, 10K+ professionals, Microsoft + Google partnerships)
- NextSteps DevCon (engineering conference + 10K+ scholarships)
Expertise: Generative AI, voice agents, OCR-LLM pipelines, LLMOps, AI education, equity in tech
Certifications: University of Oxford (AI: Cloud and Edge Implementations, 2022); Certified ScrumMaster (CSM, 2022)
`;

	return new Response(content, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400',
		},
	});
};
