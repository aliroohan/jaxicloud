import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";
import { LOCALES } from "@/lib/content/blocks";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const BlogAuthorSchema = new Schema(
  {
    name: { type: String, default: "JaxiCloud Team" },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { _id: false },
);

const BlogTranslationSchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    excerpt: { type: String, default: "" },
    contentHtml: { type: String, default: "" },
    readingTimeMinutes: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
  },
  { _id: false },
);

const translationsShape = Object.fromEntries(
  LOCALES.map((locale) => [locale, { type: BlogTranslationSchema, required: false }]),
);

const BlogPostSchema = new Schema(
  {
    // Shared across languages
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    coverImage: { type: ImageSchema, default: null },
    tags: { type: [String], default: [] },
    author: { type: BlogAuthorSchema, default: () => ({}) },
    status: { type: String, enum: ["draft", "scheduled", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
    viewCount: { type: Number, default: 0 },

    // Per-locale content (source of truth for new posts)
    translations: { type: translationsShape, default: () => ({}) },

    // Legacy single-language fields — kept for backward-compatible reads of old docs
    title: { type: String, default: "", trim: true },
    excerpt: { type: String, default: "" },
    contentHtml: { type: String, default: "" },
    readingTimeMinutes: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
// Public/admin search uses regex over translations; avoid brittle text-index migrations.

export type BlogPostDocument = InferSchemaType<typeof BlogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
