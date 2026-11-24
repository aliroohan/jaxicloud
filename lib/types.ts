import type { Locale } from "@/lib/content/blocks";

export type ImageAsset = { url: string; alt?: string };

export type BlogAuthor = {
  name?: string;
  avatarUrl?: string;
  bio?: string;
};

/** Per-locale blog fields. Shared slug/cover/tags/status live on BlogPost. */
export type BlogPostTranslation = {
  title: string;
  excerpt?: string;
  contentHtml: string;
  readingTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
};

export type BlogPost = {
  id: string;
  /** Canonical slug shared across all locales (`/[locale]/blog/[slug]`). */
  slug: string;
  coverImage?: ImageAsset | null;
  tags?: string[];
  author?: BlogAuthor;
  status?: "draft" | "scheduled" | "published";
  publishedAt?: string | null;
  viewCount?: number;
  translations?: Partial<Record<Locale, BlogPostTranslation>>;
  /** Resolved for the request locale (public API / pages). */
  title: string;
  excerpt?: string;
  contentHtml?: string;
  readingTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  resolvedLocale?: Locale;
  usedTranslationFallback?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type KeyFeature = {
  icon?: string;
  title: string;
  description?: string;
};

export type SpecGroup = {
  groupName: string;
  items: { label: string; value: string }[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  modelNumber?: string;
  tagline?: string;
  overview: string;
  categoryId: string;
  category?: Category;
  images: ImageAsset[];
  tags: string[];
  keyFeatures: KeyFeature[];
  specifications: SpecGroup[];
  certifications: string[];
  videoUrls: string[];
  specSheetUrl?: string;
  supplierSource?: string;
  price?: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InquiryItem = {
  productId?: string;
  name: string;
  slug?: string;
  quantity: number;
  type: "product";
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  items: InquiryItem[];
  status: "new" | "contacted" | "closed";
  createdAt?: string;
  updatedAt?: string;
};
