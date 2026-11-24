import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  isLocale,
} from "@/lib/i18n/config";
import type { BlogPost, BlogPostTranslation } from "@/lib/types";

export type RawBlogDoc = Record<string, unknown> & {
  title?: string;
  slug?: string;
  excerpt?: string;
  contentHtml?: string;
  readingTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  translations?: Partial<Record<string, Partial<BlogPostTranslation> | null>>;
};

export function emptyBlogTranslation(): BlogPostTranslation {
  return {
    title: "",
    excerpt: "",
    contentHtml: "",
    readingTimeMinutes: 0,
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
    canonicalUrl: "",
  };
}

/** TipTap often stores empty bodies as `<p></p>`. */
export function isBlankHtml(html?: string | null): boolean {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();
  return !text;
}

export function isTranslationFilled(
  t?: Partial<BlogPostTranslation> | null,
): boolean {
  if (!t) return false;
  return Boolean(t.title?.trim() && !isBlankHtml(t.contentHtml));
}

/** Lift legacy single-language fields into `translations.en` when needed. */
export function normalizeBlogTranslations(
  doc: RawBlogDoc,
): Partial<Record<Locale, BlogPostTranslation>> {
  const raw = doc.translations || {};
  const out: Partial<Record<Locale, BlogPostTranslation>> = {};

  for (const locale of LOCALES) {
    const t = raw[locale];
    if (!t) continue;
    out[locale] = {
      ...emptyBlogTranslation(),
      ...t,
      title: t.title || "",
      excerpt: t.excerpt || "",
      contentHtml: t.contentHtml || "",
      readingTimeMinutes: t.readingTimeMinutes || 0,
      metaTitle: t.metaTitle || "",
      metaDescription: t.metaDescription || "",
      ogImage: t.ogImage || "",
      canonicalUrl: t.canonicalUrl || "",
    };
  }

  if (Object.keys(out).length === 0 && (doc.title || doc.contentHtml)) {
    out[DEFAULT_LOCALE] = {
      title: doc.title || "",
      excerpt: doc.excerpt || "",
      contentHtml: doc.contentHtml || "",
      readingTimeMinutes: doc.readingTimeMinutes || 0,
      metaTitle: doc.metaTitle || "",
      metaDescription: doc.metaDescription || "",
      ogImage: doc.ogImage || "",
      canonicalUrl: doc.canonicalUrl || "",
    };
  }

  return out;
}

export function pickBlogTranslation(
  translations: Partial<Record<Locale, BlogPostTranslation>>,
  locale: Locale,
): { translation: BlogPostTranslation; resolvedLocale: Locale; usedFallback: boolean } | null {
  const preferred = translations[locale];
  if (preferred && isTranslationFilled(preferred)) {
    return { translation: preferred, resolvedLocale: locale, usedFallback: false };
  }

  const en = translations[DEFAULT_LOCALE];
  if (en && isTranslationFilled(en)) {
    return {
      translation: en,
      resolvedLocale: DEFAULT_LOCALE,
      usedFallback: locale !== DEFAULT_LOCALE,
    };
  }

  for (const loc of LOCALES) {
    const t = translations[loc];
    if (t && isTranslationFilled(t)) {
      return { translation: t, resolvedLocale: loc, usedFallback: loc !== locale };
    }
  }

  // Prefer any partial content over nothing (e.g. title-only drafts in admin)
  const soft =
    translations[locale] ||
    translations[DEFAULT_LOCALE] ||
    LOCALES.map((l) => translations[l]).find(Boolean);

  if (soft) {
    return {
      translation: { ...emptyBlogTranslation(), ...soft },
      resolvedLocale: locale,
      usedFallback: false,
    };
  }

  return null;
}

/** Resolve a serialized blog doc into the flat public BlogPost shape for a locale. */
export function resolveBlogPostForLocale(
  serialized: Record<string, unknown>,
  locale: string | Locale,
): BlogPost {
  const loc: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const translations = normalizeBlogTranslations(serialized as RawBlogDoc);
  const picked = pickBlogTranslation(translations, loc);
  const t = picked?.translation || emptyBlogTranslation();

  return {
    ...(serialized as unknown as BlogPost),
    translations,
    title: t.title,
    excerpt: t.excerpt,
    contentHtml: t.contentHtml,
    readingTimeMinutes: t.readingTimeMinutes,
    metaTitle: t.metaTitle,
    metaDescription: t.metaDescription,
    ogImage: t.ogImage,
    canonicalUrl: t.canonicalUrl,
    resolvedLocale: picked?.resolvedLocale,
    usedTranslationFallback: picked?.usedFallback || false,
  };
}

/** Admin list / search display title from any available translation. */
export function displayTitleFromBlogDoc(doc: RawBlogDoc): string {
  const translations = normalizeBlogTranslations(doc);
  const picked = pickBlogTranslation(translations, DEFAULT_LOCALE);
  const title = picked?.translation.title || doc.title || doc.slug;
  return (typeof title === "string" && title.trim() ? title : "Untitled");
}

export function parseLocaleParam(value: string | null | undefined): Locale {
  if (value && isLocale(value)) return value;
  return DEFAULT_LOCALE;
}
