import { z } from "zod";
import { localeSchema } from "@/lib/content/blocks";

function isBlankHtml(html?: string | null) {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
  return !text;
}

export const imageSchema = z.object({
  url: z.string().url().or(z.string().min(1)),
  alt: z.string().optional().default(""),
});

export const keyFeatureSchema = z.object({
  icon: z.string().optional().default(""),
  title: z.string().min(1),
  description: z.string().optional().default(""),
});

export const specItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const specGroupSchema = z.object({
  groupName: z.string().min(1),
  items: z.array(specItemSchema).default([]),
});

export const productInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  modelNumber: z.string().optional().default(""),
  tagline: z.string().optional().default(""),
  overview: z.string().min(1),
  categoryId: z.string().min(1),
  images: z.array(imageSchema).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  keyFeatures: z.array(keyFeatureSchema).optional().default([]),
  specifications: z.array(specGroupSchema).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  videoUrls: z.array(z.string()).optional().default([]),
  specSheetUrl: z.string().optional().default(""),
  supplierSource: z.string().optional().default(""),
  price: z.string().optional().default("Contact for pricing"),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
});

export const categoryInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
});

export const blogAuthorSchema = z.object({
  name: z.string().optional().default("JaxiCloud Team"),
  avatarUrl: z.string().optional().default(""),
  bio: z.string().optional().default(""),
});

export const blogPostTranslationSchema = z.object({
  title: z.string().optional().default(""),
  excerpt: z.string().optional().default(""),
  contentHtml: z.string().optional().default(""),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
});

export const blogPostInputSchema = z
  .object({
    slug: z.string().optional(),
    coverImage: imageSchema.nullable().optional().default(null),
    tags: z.array(z.string()).optional().default([]),
    author: blogAuthorSchema
      .optional()
      .default({ name: "JaxiCloud Team", avatarUrl: "", bio: "" }),
    status: z.enum(["draft", "scheduled", "published"]).optional().default("draft"),
    publishedAt: z.string().datetime().optional().nullable(),
    translations: z
      .partialRecord(localeSchema, blogPostTranslationSchema)
      .optional(),
    // Legacy single-language payload (still accepted; mapped to translations.en)
    title: z.string().optional(),
    excerpt: z.string().optional().default(""),
    contentHtml: z.string().optional(),
    metaTitle: z.string().optional().default(""),
    metaDescription: z.string().optional().default(""),
    ogImage: z.string().optional().default(""),
    canonicalUrl: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    const translations = { ...(data.translations || {}) };
    if (
      !Object.keys(translations).length &&
      (data.title?.trim() || !isBlankHtml(data.contentHtml))
    ) {
      translations.en = {
        title: data.title || "",
        excerpt: data.excerpt || "",
        contentHtml: data.contentHtml || "",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        ogImage: data.ogImage || "",
        canonicalUrl: data.canonicalUrl || "",
      };
    }

    const filled = Object.values(translations).filter(
      (t) => t?.title?.trim() && !isBlankHtml(t?.contentHtml),
    );
    if (filled.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one locale must have both a title and body content",
        path: ["translations"],
      });
    }
  });

export const inquiryInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  message: z.string().optional().default(""),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        name: z.string().min(1),
        slug: z.string().optional().default(""),
        quantity: z.number().int().min(1).optional().default(1),
        type: z.enum(["product"]).optional().default("product"),
      }),
    )
    .optional()
    .default([]),
});
