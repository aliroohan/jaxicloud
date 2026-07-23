"use client";

import { useEffect, useState } from "react";
import type { Inquiry } from "@/lib/types";
import styles from "@/components/admin/AdminConsole.module.css";

const statuses = ["new", "contacted", "closed"] as const;

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState("");

  async function load() {
    const qs = filter ? `?status=${filter}` : "";
    const res = await fetch(`/api/admin/inquiries${qs}`);
    const data = await res.json();
    setInquiries(data.inquiries || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function updateStatus(
    id: string,
    status: "new" | "contacted" | "closed",
  ) {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) {
      setSelected(data.inquiry);
      load();
    }
  }

  return (
    <div>
      {/* Filter Control Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-500">
          Showing {inquiries.length} Proposal Requests
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-cyan-600"
        >
          <option value="">All Lead Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Inquiries Table Card */}
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Lead Contact</th>
                <th>Company</th>
                <th>Status</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr
                  key={inq.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(inq)}
                >
                  <td>
                    <div className="font-bold text-navy">{inq.name}</div>
                    <div className="text-xs text-slate-400">{inq.email}</div>
                  </td>
                  <td>{inq.company || "—"}</td>
                  <td>
                    <span
                      className={`${styles.badgePill} ${
                        inq.status === "new"
                          ? styles.badgeGreen
                          : inq.status === "contacted"
                          ? styles.badgeCyan
                          : styles.badgeGray
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="font-semibold text-slate-700">
                    {inq.items?.length || 0} items
                  </td>
                </tr>
              ))}

              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">
                    No proposal inquiries match your selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Lead Detail Drawer Card */}
        <div className={styles.tableCard} style={{ padding: "2rem" }}>
          {selected ? (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                  INQUIRY DETAILS
                </div>
                <h2 className="font-display text-2xl font-bold text-navy mt-1">
                  {selected.name}
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  {selected.email} {selected.phone ? ` • ${selected.phone}` : ""}
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {selected.company || "Direct Commercial Operator"}
                </p>
              </div>

              {selected.message && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  {selected.message}
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Requested Hardware Items
                </h3>
                <ul className="space-y-2">
                  {(selected.items || []).map((item, idx) => (
                    <li
                      key={`${item.name}-${idx}`}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3 text-sm"
                    >
                      <span className="font-semibold text-navy">{item.name}</span>
                      <span className="text-xs font-bold text-cyan-700">
                        Qty: {item.quantity}
                      </span>
                    </li>
                  ))}
                  {(selected.items || []).length === 0 && (
                    <li className="text-sm text-slate-400 italic">
                      No specific catalog items attached. General proposal request.
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Update Lead Status
                </label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    updateStatus(
                      selected.id,
                      e.target.value as "new" | "contacted" | "closed",
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm font-semibold text-navy outline-none focus:border-cyan-600"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <p className="font-semibold">Select an inquiry from the list</p>
              <p className="text-xs mt-1">Review contact details, selected units, and SLA status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
