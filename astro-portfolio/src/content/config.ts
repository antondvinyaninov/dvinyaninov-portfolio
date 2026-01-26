import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        // Meta
        title: z.string(),
        description: z.string(),
        
        // Hero
        projectName: z.string(),
        projectLabel: z.string(),
        projectDesc: z.string(),
        projectAbout: z.string().optional(),
        projectLogo: z.string().optional(),
        projectImage: z.string().optional(),
        h1Title: z.string().optional(),
        
        // Info
        projectType: z.string(),
        projectClient: z.string(),
        projectStatus: z.string(),
        projectSite: z.string(),
        projectYear: z.string(),
        
        // Tech Stack
        techStack: z.array(z.object({
            name: z.string(),
            icon: z.string(),
        })),
        
        // Navigation
        navigation: z.array(z.object({
            id: z.string(),
            label: z.string(),
        })),
        
        // Content Sections (optional - для будущего использования)
        about: z.object({
            text: z.array(z.string()),
            audience: z.array(z.object({
                title: z.string(),
                desc: z.string(),
            })).optional(),
        }).optional(),
        
        audience: z.array(z.object({
            title: z.string(),
            desc: z.string(),
        })).optional(),
        
        features: z.array(z.object({
            title: z.string(),
            items: z.array(z.string()),
        })).optional(),
        
        screenshots: z.array(z.object({
            title: z.string(),
            desc: z.string().optional(),
            gradient: z.string(),
            large: z.boolean().optional(),
            wide: z.boolean().optional(),
            image: z.string().optional(),
        })).optional(),
        
        roadmap: z.array(z.object({
            title: z.string(),
            type: z.enum(['progress', 'planned']),
            items: z.array(z.string()),
        })).optional(),
        
        betaForm: z.boolean().optional(),
        
        // Additional content blocks
        problem: z.object({
            text: z.array(z.string()),
        }).optional(),
        
        solution: z.object({
            text: z.array(z.string()),
        }).optional(),
        
        modules: z.array(z.object({
            title: z.string(),
            items: z.array(z.string()),
        })).optional(),
        
        petid: z.object({
            text: z.array(z.string()),
        }).optional(),
        
        personas: z.array(z.object({
            title: z.string(),
            desc: z.string(),
        })).optional(),
        
        architecture: z.object({
            text: z.array(z.string()),
        }).optional(),
        
        metrics: z.object({
            text: z.array(z.string()),
        }).optional(),
        
        beta: z.object({
            text: z.array(z.string()),
        }).optional(),
        
        team: z.object({
            intro: z.array(z.string()),
            needed: z.array(z.object({
                role: z.string(),
                desc: z.string(),
            })),
            contact: z.array(z.string()),
        }).optional(),
        
        servicesSummary: z.object({
            totalPlanned: z.number(),
            activeOnTest: z.number(),
            includeSocialNetwork: z.boolean(),
            description: z.string(),
            activeModules: z.array(z.object({
                id: z.string(),
                name: z.string(),
                desc: z.string(),
            })),
            plannedModules: z.array(z.object({
                id: z.string(),
                name: z.string(),
                desc: z.string(),
            })),
        }).optional(),
        
        // SEO
        seo: z.object({
            ogImage: z.string().optional(),
            ogType: z.string().optional(),
            twitterCard: z.string().optional(),
            keywords: z.array(z.string()).optional(),
            author: z.string().optional(),
            canonical: z.string().optional(),
        }).optional(),
        
        // Optional
        order: z.number().optional(),
        featured: z.boolean().optional(),
        hideSidebarForm: z.boolean().optional(),
    }),
});

export const collections = {
    'projects': projectsCollection,
};
