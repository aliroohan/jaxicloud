"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import styles from "@/components/admin/AdminConsole.module.css";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_BADGE: Record<string, string> = {
  published: "badgeGreen",
  scheduled: "badgeCyan",
  draft: "badgeGray",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/blog?${params.toString()}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
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
              placeholder="Search posts by title, slug, or tag..."
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
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>

          <button type="submit" className={styles.actionBtn}>
            Apply Filter
          </button>
        </form>

        <Link href="/admin/blog/new" className={styles.primaryAddBtn}>
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </Link>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Blog Posts ({posts.length})</h2>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-6 py-10 text-center text-slate-500" colSpan={5}>
                  Loading blog posts...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td className="px-6 py-10 text-center text-slate-500" colSpan={5}>
                  No blog posts found. Try adjusting your search query.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-bold text-navy">{p.title}</div>
                    <div className="text-xs text-slate-400">{p.slug}</div>
                  </td>
                  <td>
                    <span
                      className={`${styles.badgePill} ${
                        (styles as Record<string, string>)[
                          STATUS_BADGE[p.status as string] || "badgeGray"
                        ]
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="text-xs text-slate-600">
                    {p.tags?.length ? p.tags.join(", ") : "—"}
                  </td>
                  <td className="text-xs text-slate-600">
                    {formatDate(p.publishedAt)}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${p.id}`}
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
