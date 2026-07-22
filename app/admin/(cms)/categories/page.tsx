"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

const empty = { name: "", slug: "", description: "", icon: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(
      editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    if (!confirm("Delete category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="font-display text-3xl">Categories</h1>
        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-5"
        >
          <h2 className="font-medium">
            {editingId ? "Edit category" : "New category"}
          </h2>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {(["name", "slug", "icon"] as const).map((field) => (
            <label key={field} className="block text-sm">
              <span className="mb-1 block capitalize">{field}</span>
              <input
                required={field === "name"}
                value={form[field]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
          ))}
          <label className="block text-sm">
            <span className="mb-1 block">Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
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
                className="rounded-md border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-start justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-slate-500">{c.slug}</p>
                <p className="mt-1 text-sm text-slate-600">{c.description}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  className="text-cyan-700"
                  onClick={() => {
                    setEditingId(c.id);
                    setForm({
                      name: c.name,
                      slug: c.slug,
                      description: c.description || "",
                      icon: c.icon || "",
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => remove(c.id)}
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
