import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

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

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    coverImage: { type: ImageSchema, default: null },
    contentHtml: { type: String, required: true },
    tags: { type: [String], default: [] },
    author: { type: BlogAuthorSchema, default: () => ({}) },
    status: { type: String, enum: ["draft", "scheduled", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
    readingTimeMinutes: { type: Number, default: 0 },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ title: "text", excerpt: "text", contentHtml: "text" });

export type BlogPostDocument = InferSchemaType<typeof BlogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
