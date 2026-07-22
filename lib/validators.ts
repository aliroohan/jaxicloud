import { z } from "zod";

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
  solutionIds: z.array(z.string()).optional().default([]),
});

export const categoryInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
});

export const bundleInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  images: z.array(imageSchema).optional().default([]),
  productIds: z.array(z.string()).optional().default([]),
  price: z.string().optional().default("Contact for pricing"),
  status: z.enum(["draft", "published"]).optional().default("draft"),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
});

export const solutionInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional().default(""),
  productIds: z.array(z.string()).optional().default([]),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
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
        bundleId: z.string().optional(),
        name: z.string().min(1),
        slug: z.string().optional().default(""),
        quantity: z.number().int().min(1).optional().default(1),
        type: z.enum(["product", "bundle"]).optional().default("product"),
      }),
    )
    .optional()
    .default([]),
});
