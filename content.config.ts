import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    resources: defineCollection({
      type: "page",
      source: "resources/**/*.md",
      schema: z.object({
        id: z.string().optional(),
        category: z.string().optional(),
        categorySlug: z.string().optional(),
        module: z.string().optional(),
        level: z.number().optional(),
        seq: z.number().optional(),
        tags: z.string().optional(),
        resourceType: z.string().optional(),
        estMinutes: z.number().nullable().optional(),
        monetization: z.string().optional(),
        cta: z.string().optional(),
        prereqIds: z.array(z.string()).optional(),
      }),
    }),
  },
});
