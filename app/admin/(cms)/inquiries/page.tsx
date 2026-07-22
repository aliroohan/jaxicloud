"use client";

import { useEffect, useState } from "react";
import type { Inquiry } from "@/lib/types";

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Inquiries</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quote requests from contact and inquiry forms.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Items</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr
                  key={inq.id}
                  className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                  onClick={() => setSelected(inq)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{inq.name}</div>
                    <div className="text-xs text-slate-500">{inq.email}</div>
                  </td>
                  <td className="px-4 py-3">{inq.company || "—"}</td>
                  <td className="px-4 py-3">{inq.status}</td>
                  <td className="px-4 py-3">{inq.items?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          {selected ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{selected.name}</h2>
              <p className="text-sm text-slate-600">
                {selected.email}
                {selected.phone ? ` · ${selected.phone}` : ""}
              </p>
              <p className="text-sm text-slate-600">
                {selected.company || "No company"}
              </p>
              <p className="text-sm whitespace-pre-wrap">{selected.message}</p>
              <div>
                <h3 className="text-sm font-medium">Items</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {(selected.items || []).map((item, idx) => (
                    <li key={`${item.name}-${idx}`}>
                      {item.quantity}× {item.name} ({item.type})
                    </li>
                  ))}
                  {(selected.items || []).length === 0 ? (
                    <li className="text-slate-500">No catalog items</li>
                  ) : null}
                </ul>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Status</span>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    updateStatus(
                      selected.id,
                      e.target.value as "new" | "contacted" | "closed",
                    )
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Select an inquiry to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
