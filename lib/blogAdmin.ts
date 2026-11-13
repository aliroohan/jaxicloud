import { LOCALES, type Locale } from "@/lib/content/blocks";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { computeReadingTimeMinutes } from "@/lib/readingTime";
import { slugify } from "@/lib/slugify";
import type { BlogPostTranslation } from "@/lib/types";
import {
  emptyBlogTranslation,
  isBlankHtml,
  pickBlogTranslation,
} from "@/lib/blogTranslations";
import type { z } from "zod";
import type { blogPostInputSchema } from "@/lib/validators";

type BlogPostInput = z.infer<typeof blogPostInputSchema>;

export function buildTranslationsFromInput(
  data: BlogPostInput,
): Partial<Record<Locale, BlogPostTranslation>> {
  const translations: Partial<Record<Locale, BlogPostTranslation>> = {};

  const incoming = data.translations || {};
  for (const locale of LOCALES) {
    const t = incoming[locale];
    if (!t) continue;
    const title = t.title?.trim() || "";
    const contentHtml = t.contentHtml || "";
    // Skip completely empty locale slots
    if (
      !title &&
      isBlankHtml(contentHtml) &&
      !(t.excerpt || "").trim() &&
      !(t.metaTitle || "").trim() &&
      !(t.metaDescription || "").trim()
    ) {
      continue;
    }
    translations[locale] = {
      title,
      excerpt: t.excerpt || "",
      contentHtml: isBlankHtml(contentHtml) ? "" : contentHtml,
      readingTimeMinutes:
        !isBlankHtml(contentHtml) ? computeReadingTimeMinutes(contentHtml) : 0,
      metaTitle: t.metaTitle || "",
      metaDescription: t.metaDescription || "",
      ogImage: t.ogImage || "",
      canonicalUrl: t.canonicalUrl || "",
    };
  }

  // Legacy flat payload → en
  if (
    Object.keys(translations).length === 0 &&
    (data.title?.trim() || !isBlankHtml(data.contentHtml))
  ) {
    const contentHtml = data.contentHtml || "";
    translations[DEFAULT_LOCALE] = {
      title: data.title?.trim() || "",
      excerpt: data.excerpt || "",
      contentHtml: isBlankHtml(contentHtml) ? "" : contentHtml,
      readingTimeMinutes: !isBlankHtml(contentHtml)
        ? computeReadingTimeMinutes(contentHtml)
        : 0,
      metaTitle: data.metaTitle || "",
      metaDescription: data.metaDescription || "",
      ogImage: data.ogImage || "",
      canonicalUrl: data.canonicalUrl || "",
    };
  }

  return translations;
}

export function resolveSlugFromInput(
  data: BlogPostInput,
  translations: Partial<Record<Locale, BlogPostTranslation>>,
): string {
  if (data.slug?.trim()) return slugify(data.slug.trim());
  const picked = pickBlogTranslation(translations, DEFAULT_LOCALE);
  if (picked?.translation.title) return slugify(picked.translation.title);
  for (const locale of LOCALES) {
    const title = translations[locale]?.title?.trim();
    if (title) return slugify(title);
  }
  return slugify(data.title || "post");
}

/** Denormalize primary (en / first filled) translation onto legacy top-level fields. */
export function denormalizePrimaryTranslation(
  translations: Partial<Record<Locale, BlogPostTranslation>>,
) {
  const picked = pickBlogTranslation(translations, DEFAULT_LOCALE);
  const t = picked?.translation || emptyBlogTranslation();
  return {
    title: t.title,
    excerpt: t.excerpt || "",
    contentHtml: t.contentHtml,
    readingTimeMinutes: t.readingTimeMinutes || 0,
    metaTitle: t.metaTitle || "",
    metaDescription: t.metaDescription || "",
    ogImage: t.ogImage || "",
    canonicalUrl: t.canonicalUrl || "",
  };
}

export function publishedAtFromInput(data: BlogPostInput): Date | null {
  if (data.status === "published" && !data.publishedAt) return new Date();
  if (data.publishedAt) return new Date(data.publishedAt);
  return null;
}

export function buildAdminBlogSearchFilter(q: string): Record<string, unknown>[] {
  const regex = { $regex: q, $options: "i" };
  const clauses: Record<string, unknown>[] = [
    { slug: regex },
    { title: regex },
    { excerpt: regex },
    { tags: regex },
  ];
  for (const locale of LOCALES) {
    clauses.push({ [`translations.${locale}.title`]: regex });
    clauses.push({ [`translations.${locale}.excerpt`]: regex });
  }
  return clauses;
}

export function buildPublicBlogSearchFilter(q: string): Record<string, unknown> {
  const regex = { $regex: q, $options: "i" };
  const or: Record<string, unknown>[] = [
    { title: regex },
    { excerpt: regex },
    { tags: regex },
  ];
  for (const locale of LOCALES) {
    or.push({ [`translations.${locale}.title`]: regex });
    or.push({ [`translations.${locale}.excerpt`]: regex });
    or.push({ [`translations.${locale}.contentHtml`]: regex });
  }
  return { $or: or };
}
