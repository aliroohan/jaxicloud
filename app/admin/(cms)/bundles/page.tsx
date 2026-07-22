"use client";

import { useEffect, useState } from "react";
import type { Bundle, Product } from "@/lib/types";

const empty = {
  name: "",
  slug: "",
  description: "",
  price: "Contact for pricing",
  status: "draft" as "draft" | "published",
  imageUrl: "",
  productIds: [] as string[],
};

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [bRes, pRes] = await Promise.all([
      fetch("/api/admin/bundles"),
      fetch("/api/admin/products"),
    ]);
    const bData = await bRes.json();
    const pData = await pRes.json();
    setBundles(bData.bundles || []);
    setProducts(pData.products || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      price: form.price,
      status: form.status,
      images: form.imageUrl ? [{ url: form.imageUrl, alt: form.name }] : [],
      productIds: form.productIds,
    };
    const res = await fetch(
      editingId ? `/api/admin/bundles/${editingId}` : "/api/admin/bundles",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    setForm(empty);
    setEditingId(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete bundle?")) return;
    await fetch(`/api/admin/bundles/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h1 className="font-display text-3xl">Bundles</h1>
        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-5"
        >
          <h2 className="font-medium">
            {editingId ? "Edit bundle" : "New bundle"}
          </h2>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <label className="block text-sm">
            <span className="mb-1 block">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block">Slug</span>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block">Description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block">Image URL</span>
            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block">Price</span>
            <input
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block">Status</span>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as "draft" | "published",
                }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <fieldset className="text-sm">
            <legend className="mb-2 font-medium">Products</legend>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-3">
              {products.map((p) => (
                <label key={p.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.productIds.includes(p.id)}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        productIds: e.target.checked
                          ? [...f.productIds, p.id]
                          : f.productIds.filter((id) => id !== p.id),
                      }))
                    }
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-cyan-700 px-4 py-2 text-sm text-white"
            >
              Save
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {bundles.map((b) => (
            <li
              key={b.id}
              className="flex items-start justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="text-xs text-slate-500">
                  {b.status} · {(b.productIds || []).length} products
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  className="text-cyan-700"
                  onClick={() => {
                    setEditingId(b.id);
                    setForm({
                      name: b.name,
                      slug: b.slug,
                      description: b.description,
                      price: b.price || "Contact for pricing",
                      status: b.status,
                      imageUrl: b.images?.[0]?.url || "",
                      productIds: (b.productIds || []).map(String),
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => remove(b.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
