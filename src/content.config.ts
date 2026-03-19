import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const tagsField = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((value) => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return value
      .split(/[\s,]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  });

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog"
  }),
  schema: z.object({
    layout: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: tagsField,
    github: z.string().optional()
  })
});

export const collections = {
  blog
};
