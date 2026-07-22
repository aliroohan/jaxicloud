"use client";

import { useEffect, useState } from "react";
import type { Product, Solution } from "@/lib/types";

const empty = {
  name: "",
  slug: "",
  description: "",
  productIds: [] as string[],
};

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const [sRes, pRes] = await Promise.all([
      fetch("/api/admin/solutions"),
      fetch("/api/admin/products"),
    ]);
    const sData = await sRes.json();
    const pData = await pRes.json();
    setSolutions(sData.solutions || []);
    setProducts(pData.products || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(
      editingId ? `/api/admin/solutions/${editingId}` : "/api/admin/solutions",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          description: form.description,
          productIds: form.productIds,
        }),
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
    if (!confirm("Delete solution?")) return;
    await fetch(`/api/admin/solutions/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h1 className="font-display text-3xl">Solutions</h1>
        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-5"
        >
          <h2 className="font-medium">
            {editingId ? "Edit solution" : "New solution"}
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
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
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
          {solutions.map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-slate-500">
                  {(s.productIds || []).length} products
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  className="text-cyan-700"
                  onClick={() => {
                    setEditingId(s.id);
                    setForm({
                      name: s.name,
                      slug: s.slug,
                      description: s.description || "",
                      productIds: (s.productIds || []).map(String),
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => remove(s.id)}
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
