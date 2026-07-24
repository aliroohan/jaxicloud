"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import styles from "@/components/admin/AdminConsole.module.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      {/* Header Controls & Filter Row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <form
          className="flex flex-wrap items-center gap-3 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <div className="relative flex-1 min-w-[240px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products by model number, name, or slug..."
              className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-cyan-600"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-cyan-600"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <button type="submit" className={styles.actionBtn}>
            Apply Filter
          </button>
        </form>

        <Link href="/admin/products/new" className={styles.primaryAddBtn}>
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Streamax Products ({products.length})</h2>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hardware Product</th>
              <th>Category</th>
              <th>Model Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-10 text-center text-slate-500" colSpan={5}>
                  Loading catalog inventory...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td className="px-6 py-10 text-center text-slate-500" colSpan={5}>
                  No products found. Try adjusting your search query.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-bold text-navy">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.slug}</div>
                  </td>
                  <td>
                    <span className={`${styles.badgePill} ${styles.badgeCyan}`}>
                      {p.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="font-mono text-xs font-semibold text-slate-600">
                    {p.modelNumber || "N/A"}
                  </td>
                  <td>
                    <span
                      className={`${styles.badgePill} ${
                        p.status === "published"
                          ? styles.badgeGreen
                          : styles.badgeGray
                      }`}
                    >
                      {p.status || "published"}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className={styles.actionBtn}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
