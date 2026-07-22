"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product, Solution } from "@/lib/types";

type Props = {
  initial?: Partial<Product> | null;
  productId?: string;
};

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProductForm({ initial, productId }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [modelNumber, setModelNumber] = useState(initial?.modelNumber || "");
  const [tagline, setTagline] = useState(initial?.tagline || "");
  const [overview, setOverview] = useState(initial?.overview || "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId || "");
  const [price, setPrice] = useState(initial?.price || "Contact for pricing");
  const [status, setStatus] = useState<"draft" | "published">(
    initial?.status || "draft",
  );
  const [tags, setTags] = useState((initial?.tags || []).join("\n"));
  const [certifications, setCertifications] = useState(
    (initial?.certifications || []).join("\n"),
  );
  const [videoUrls, setVideoUrls] = useState(
    (initial?.videoUrls || []).join("\n"),
  );
  const [specSheetUrl, setSpecSheetUrl] = useState(initial?.specSheetUrl || "");
  const [supplierSource, setSupplierSource] = useState(
    initial?.supplierSource || "",
  );
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription || "",
  );
  const [imageUrl, setImageUrl] = useState(initial?.images?.[0]?.url || "");
  const [imageAlt, setImageAlt] = useState(initial?.images?.[0]?.alt || "");
  const [solutionIds, setSolutionIds] = useState<string[]>(
    (initial?.solutionIds || []).map(String),
  );
  const [keyFeaturesJson, setKeyFeaturesJson] = useState(
    JSON.stringify(initial?.keyFeatures || [], null, 2),
  );
  const [specsJson, setSpecsJson] = useState(
    JSON.stringify(initial?.specifications || [], null, 2),
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/solutions").then((r) => r.json()),
    ]).then(([catData, solData]) => {
      setCategories(catData.categories || []);
      setSolutions(solData.solutions || []);
      if (!categoryId && catData.categories?.[0]?.id) {
        setCategoryId(catData.categories[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = useMemo(
    () => (productId ? "Edit product" : "New product"),
    [productId],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let keyFeatures = [];
      let specifications = [];
      try {
        keyFeatures = JSON.parse(keyFeaturesJson || "[]");
        specifications = JSON.parse(specsJson || "[]");
      } catch {
        throw new Error("Key features / specifications must be valid JSON");
      }

      const payload = {
        name,
        slug: slug || undefined,
        modelNumber,
        tagline,
        overview,
        categoryId,
        images: imageUrl ? [{ url: imageUrl, alt: imageAlt }] : [],
        tags: linesToArray(tags),
        keyFeatures,
        specifications,
        certifications: linesToArray(certifications),
        videoUrls: linesToArray(videoUrls),
        specSheetUrl,
        supplierSource,
        price,
        status,
        metaTitle,
        metaDescription,
        solutionIds,
      };

      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-5">
      <h1 className="font-display text-3xl">{title}</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Slug (optional)</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Model number</span>
          <input
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Tagline</span>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Overview</span>
          <textarea
            required
            rows={4}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Category</span>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "published")
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Price</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Supplier source (internal)</span>
          <input
            value={supplierSource}
            onChange={(e) => setSupplierSource(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Image URL</span>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://… (Cloudinary optional — paste URL works)"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Image alt</span>
          <input
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Tags (one per line)</span>
          <textarea
            rows={4}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Certifications</span>
          <textarea
            rows={4}
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Video URLs</span>
          <textarea
            rows={3}
            value={videoUrls}
            onChange={(e) => setVideoUrls(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Spec sheet URL</span>
          <input
            value={specSheetUrl}
            onChange={(e) => setSpecSheetUrl(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Solutions</span>
          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            {solutions.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={solutionIds.includes(s.id)}
                  onChange={(e) => {
                    setSolutionIds((prev) =>
                      e.target.checked
                        ? [...prev, s.id]
                        : prev.filter((id) => id !== s.id),
                    );
                  }}
                />
                {s.name}
              </label>
            ))}
          </div>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Key features (JSON)</span>
          <textarea
            rows={6}
            value={keyFeaturesJson}
            onChange={(e) => setKeyFeaturesJson(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Specifications (JSON)</span>
          <textarea
            rows={6}
            value={specsJson}
            onChange={(e) => setSpecsJson(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Meta title</span>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Meta description</span>
          <input
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-cyan-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-600 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
