"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import type { Category, KeyFeature, Product, SpecGroup } from "@/lib/types";

type Props = {
  initial?: Partial<Product> | null;
  productId?: string;
};

type FeatureRow = { icon: string; title: string; description: string };
type SpecItemRow = { label: string; value: string };
type SpecGroupRow = { groupName: string; items: SpecItemRow[] };

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function emptyFeature(): FeatureRow {
  return { icon: "", title: "", description: "" };
}

function emptySpecItem(): SpecItemRow {
  return { label: "", value: "" };
}

function emptySpecGroup(): SpecGroupRow {
  return { groupName: "", items: [emptySpecItem()] };
}

function initFeatures(initial?: Partial<Product> | null): FeatureRow[] {
  const rows = (initial?.keyFeatures || []).map((f) => ({
    icon: f.icon || "",
    title: f.title || "",
    description: f.description || "",
  }));
  return rows.length ? rows : [emptyFeature()];
}

function initSpecs(initial?: Partial<Product> | null): SpecGroupRow[] {
  const groups = (initial?.specifications || []).map((g) => ({
    groupName: g.groupName || "",
    items:
      g.items?.length
        ? g.items.map((i) => ({ label: i.label || "", value: i.value || "" }))
        : [emptySpecItem()],
  }));
  return groups.length ? groups : [emptySpecGroup()];
}

const fieldClass = "w-full rounded-md border border-slate-300 px-3 py-2";
const iconBtnClass =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50";
const addBtnClass =
  "inline-flex items-center gap-1.5 rounded-md border border-cyan-700 px-3 py-1.5 text-sm font-medium text-cyan-800 hover:bg-cyan-50";

export function ProductForm({ initial, productId }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [features, setFeatures] = useState<FeatureRow[]>(() =>
    initFeatures(initial),
  );
  const [specGroups, setSpecGroups] = useState<SpecGroupRow[]>(() =>
    initSpecs(initial),
  );

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((catData) => {
        setCategories(catData.categories || []);
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
      const keyFeatures: KeyFeature[] = features
        .map((f) => ({
          icon: f.icon.trim(),
          title: f.title.trim(),
          description: f.description.trim(),
        }))
        .filter((f) => f.title);

      const specifications: SpecGroup[] = specGroups
        .map((g) => ({
          groupName: g.groupName.trim(),
          items: g.items
            .map((i) => ({
              label: i.label.trim(),
              value: i.value.trim(),
            }))
            .filter((i) => i.label && i.value),
        }))
        .filter((g) => g.groupName && g.items.length);

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
        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Key features</span>
            <button
              type="button"
              className={addBtnClass}
              onClick={() => setFeatures((rows) => [...rows, emptyFeature()])}
            >
              <Plus className="h-4 w-4" />
              Add feature
            </button>
          </div>
          <div className="space-y-3">
            {features.map((row, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  value={row.title}
                  onChange={(e) =>
                    setFeatures((rows) =>
                      rows.map((r, i) =>
                        i === index ? { ...r, title: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="Feature title"
                  className={fieldClass}
                />
                <input
                  value={row.description}
                  onChange={(e) =>
                    setFeatures((rows) =>
                      rows.map((r, i) =>
                        i === index ? { ...r, description: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="Description (optional)"
                  className={fieldClass}
                />
                <button
                  type="button"
                  className={iconBtnClass}
                  aria-label="Remove feature"
                  onClick={() =>
                    setFeatures((rows) =>
                      rows.length === 1
                        ? [emptyFeature()]
                        : rows.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  value={row.icon}
                  onChange={(e) =>
                    setFeatures((rows) =>
                      rows.map((r, i) =>
                        i === index ? { ...r, icon: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="Icon name (optional)"
                  className={`${fieldClass} sm:col-span-2`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Specifications</span>
            <button
              type="button"
              className={addBtnClass}
              onClick={() =>
                setSpecGroups((groups) => [...groups, emptySpecGroup()])
              }
            >
              <Plus className="h-4 w-4" />
              Add group
            </button>
          </div>
          <div className="space-y-4">
            {specGroups.map((group, gIndex) => (
              <div
                key={gIndex}
                className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="flex gap-2">
                  <input
                    value={group.groupName}
                    onChange={(e) =>
                      setSpecGroups((groups) =>
                        groups.map((g, i) =>
                          i === gIndex
                            ? { ...g, groupName: e.target.value }
                            : g,
                        ),
                      )
                    }
                    placeholder="Group name (e.g. Camera)"
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    className={iconBtnClass}
                    aria-label="Remove specification group"
                    onClick={() =>
                      setSpecGroups((groups) =>
                        groups.length === 1
                          ? [emptySpecGroup()]
                          : groups.filter((_, i) => i !== gIndex),
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
                {group.items.map((item, iIndex) => (
                  <div key={iIndex} className="flex gap-2">
                    <input
                      value={item.label}
                      onChange={(e) =>
                        setSpecGroups((groups) =>
                          groups.map((g, gi) =>
                            gi === gIndex
                              ? {
                                  ...g,
                                  items: g.items.map((it, ii) =>
                                    ii === iIndex
                                      ? { ...it, label: e.target.value }
                                      : it,
                                  ),
                                }
                              : g,
                          ),
                        )
                      }
                      placeholder="Label"
                      className={fieldClass}
                    />
                    <input
                      value={item.value}
                      onChange={(e) =>
                        setSpecGroups((groups) =>
                          groups.map((g, gi) =>
                            gi === gIndex
                              ? {
                                  ...g,
                                  items: g.items.map((it, ii) =>
                                    ii === iIndex
                                      ? { ...it, value: e.target.value }
                                      : it,
                                  ),
                                }
                              : g,
                          ),
                        )
                      }
                      placeholder="Value"
                      className={fieldClass}
                    />
                    <button
                      type="button"
                      className={iconBtnClass}
                      aria-label="Remove specification row"
                      onClick={() =>
                        setSpecGroups((groups) =>
                          groups.map((g, gi) =>
                            gi === gIndex
                              ? {
                                  ...g,
                                  items:
                                    g.items.length === 1
                                      ? [emptySpecItem()]
                                      : g.items.filter((_, ii) => ii !== iIndex),
                                }
                              : g,
                          ),
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={addBtnClass}
                  onClick={() =>
                    setSpecGroups((groups) =>
                      groups.map((g, gi) =>
                        gi === gIndex
                          ? { ...g, items: [...g.items, emptySpecItem()] }
                          : g,
                      ),
                    )
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add row
                </button>
              </div>
            ))}
          </div>
        </div>
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
