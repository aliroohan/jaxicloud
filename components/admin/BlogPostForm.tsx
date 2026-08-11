"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { BlogPost, BlogPostTranslation } from "@/lib/types";
import { slugify } from "@/lib/slugify";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  type Locale,
} from "@/lib/i18n/config";
import {
  emptyBlogTranslation,
  isBlankHtml,
  isTranslationFilled,
  normalizeBlogTranslations,
} from "@/lib/blogTranslations";

type Props = {
  initial?: Partial<BlogPost> | null;
  postId?: string;
};

function linesToArray(value: string) {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function isoToDatetimeLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function initialTranslations(
  initial?: Partial<BlogPost> | null,
): Record<Locale, BlogPostTranslation> {
  const normalized = normalizeBlogTranslations({
    title: initial?.title,
    excerpt: initial?.excerpt,
    contentHtml: initial?.contentHtml,
    readingTimeMinutes: initial?.readingTimeMinutes,
    metaTitle: initial?.metaTitle,
    metaDescription: initial?.metaDescription,
    ogImage: initial?.ogImage,
    canonicalUrl: initial?.canonicalUrl,
    translations: initial?.translations,
  });

  const out = {} as Record<Locale, BlogPostTranslation>;
  for (const locale of LOCALES) {
    out[locale] = {
      ...emptyBlogTranslation(),
      ...(normalized[locale] || {}),
    };
  }
  return out;
}

export function BlogPostForm({ initial, postId }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [activeLocale, setActiveLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [authorOpen, setAuthorOpen] = useState(
    Boolean(initial?.author?.name && initial.author.name !== "JaxiCloud Team") ||
      Boolean(initial?.author?.avatarUrl || initial?.author?.bio),
  );

  const [translations, setTranslations] = useState(() =>
    initialTranslations(initial),
  );
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [coverUrl, setCoverUrl] = useState(initial?.coverImage?.url || "");
  const [coverAlt, setCoverAlt] = useState(initial?.coverImage?.alt || "");
  const [tags, setTags] = useState((initial?.tags || []).join("\n"));
  const [authorName, setAuthorName] = useState(
    initial?.author?.name || "JaxiCloud Team",
  );
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState(
    initial?.author?.avatarUrl || "",
  );
  const [authorBio, setAuthorBio] = useState(initial?.author?.bio || "");
  const [status, setStatus] = useState<"draft" | "scheduled" | "published">(
    initial?.status || "draft",
  );
  const [publishedAt, setPublishedAt] = useState(
    isoToDatetimeLocal(initial?.publishedAt),
  );

  const heading = useMemo(
    () => (postId ? "Edit blog post" : "New blog post"),
    [postId],
  );

  const active = translations[activeLocale];

  function updateActive(patch: Partial<BlogPostTranslation>) {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], ...patch },
    }));
  }

  function onTitleChange(next: string) {
    updateActive({ title: next });
    if (!slugTouched && activeLocale === DEFAULT_LOCALE) {
      setSlug(slugify(next));
    }
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data as { url: string; alt?: string };
  }

  async function onCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    setError("");
    try {
      const data = await uploadFile(file);
      setCoverUrl(data.url);
      if (!coverAlt) setCoverAlt(data.alt || file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover image upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payloadTranslations: Partial<Record<Locale, BlogPostTranslation>> = {};
      for (const locale of LOCALES) {
        const t = translations[locale];
        if (
          !t.title.trim() &&
          isBlankHtml(t.contentHtml) &&
          !(t.excerpt || "").trim() &&
          !(t.metaTitle || "").trim() &&
          !(t.metaDescription || "").trim()
        ) {
          continue;
        }
        payloadTranslations[locale] = {
          title: t.title,
          excerpt: t.excerpt || "",
          contentHtml: isBlankHtml(t.contentHtml) ? "" : t.contentHtml,
          metaTitle: t.metaTitle || "",
          metaDescription: t.metaDescription || "",
          ogImage: t.ogImage || "",
          canonicalUrl: t.canonicalUrl || "",
        };
      }

      const payload = {
        slug: slug || undefined,
        coverImage: coverUrl ? { url: coverUrl, alt: coverAlt } : null,
        tags: linesToArray(tags),
        author: {
          name: authorName || "JaxiCloud Team",
          avatarUrl: authorAvatarUrl,
          bio: authorBio,
        },
        status,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
        translations: payloadTranslations,
      };

      const res = await fetch(
        postId ? `/api/admin/blog/${postId}` : "/api/admin/blog",
        {
          method: postId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-5">
      <h1 className="font-display text-3xl">{heading}</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Slug (shared across languages)</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Used in every locale URL: /{"{locale}"}/blog/{slug || "…"}
          </span>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "scheduled" | "published")
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </label>
        {status !== "draft" ? (
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">
              {status === "scheduled" ? "Publish at" : "Published at (optional override)"}
            </span>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
        ) : null}

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Cover image</span>
          <div className="flex flex-wrap items-center gap-3">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={coverAlt}
                className="h-16 w-24 rounded-md border border-slate-200 object-cover"
              />
            ) : null}
            <label className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:border-cyan-600">
              {uploadingCover ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onCoverFileChange}
              />
            </label>
          </div>
          <input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://… (Cloudinary optional — paste URL works)"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Cover image alt text</span>
          <input
            value={coverAlt}
            onChange={(e) => setCoverAlt(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Tags (one per line or comma-separated)</span>
          <textarea
            rows={3}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setAuthorOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
          >
            <span>Author (optional)</span>
            {authorOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {authorOpen ? (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Name</span>
                <input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Avatar URL</span>
                <input
                  value={authorAvatarUrl}
                  onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium">Bio</span>
                <textarea
                  rows={2}
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Translations</h2>
          <p className="mt-1 text-xs text-slate-500">
            Switch languages below. Filled locales show a green dot; empty show gray.
            At least one language needs a title and body.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {LOCALES.map((locale) => {
            const filled = isTranslationFilled(translations[locale]);
            const isActive = locale === activeLocale;
            return (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveLocale(locale)}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "border-cyan-700 bg-cyan-50 text-cyan-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    filled ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                  aria-hidden
                />
                {LOCALE_LABELS[locale].code}
              </button>
            );
          })}
        </div>

        <p className="mb-4 text-sm font-medium text-slate-700">
          Editing: {LOCALE_LABELS[activeLocale].native} ({LOCALE_LABELS[activeLocale].label})
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Title</span>
            <input
              value={active.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Excerpt</span>
            <textarea
              rows={3}
              value={active.excerpt || ""}
              onChange={(e) => updateActive({ excerpt: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Body</span>
            <RichTextEditor
              key={activeLocale}
              value={active.contentHtml || ""}
              onChange={(html) => updateActive({ contentHtml: html })}
            />
          </label>

          <div className="sm:col-span-2 border-t border-slate-200 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              SEO ({LOCALE_LABELS[activeLocale].code})
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Meta title</span>
                <input
                  value={active.metaTitle || ""}
                  onChange={(e) => updateActive({ metaTitle: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Meta description</span>
                <input
                  value={active.metaDescription || ""}
                  onChange={(e) =>
                    updateActive({ metaDescription: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">OG image URL</span>
                <input
                  value={active.ogImage || ""}
                  onChange={(e) => updateActive({ ogImage: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Canonical URL</span>
                <input
                  value={active.canonicalUrl || ""}
                  onChange={(e) =>
                    updateActive({ canonicalUrl: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-600 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save post"}
      </button>
    </form>
  );
}
