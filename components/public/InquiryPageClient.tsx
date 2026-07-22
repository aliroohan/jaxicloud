"use client";

import Link from "next/link";
import { useState } from "react";
import { useInquiryStore } from "@/store/inquiry";

export function InquiryPageClient() {
  const { items, removeItem, updateQuantity, clear } = useInquiryStore();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Add at least one product or bundle first.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      message: String(form.get("message") || ""),
      items: items.map((item) => ({
        productId: item.type === "product" ? item.id : undefined,
        bundleId: item.type === "bundle" ? item.id : undefined,
        name: item.name,
        slug: item.slug,
        quantity: item.quantity,
        type: item.type,
      })),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit");
      }
      clear();
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-medium text-navy">Items</h2>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Your list is empty.{" "}
            <Link href="/products" className="text-accent hover:underline">
              Browse products
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {items.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium text-navy">{item.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {item.type}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.id,
                        item.type,
                        Number(e.target.value) || 1,
                      )
                    }
                    className="w-16 rounded-md border border-border px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id, item.type)}
                    className="text-sm text-[var(--danger)] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <h2 className="font-medium text-navy">Contact details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Name</span>
            <input
              required
              name="name"
              className="w-full rounded-md border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Email</span>
            <input
              required
              type="email"
              name="email"
              className="w-full rounded-md border border-border px-3 py-2"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Phone</span>
            <input name="phone" className="w-full rounded-md border border-border px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Company</span>
            <input name="company" className="w-full rounded-md border border-border px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Message</span>
          <textarea
            name="message"
            rows={4}
            className="w-full rounded-md border border-border px-3 py-2"
            placeholder="Fleet size, timeline, preferred products…"
          />
        </label>
        {status === "ok" ? (
          <p className="text-sm text-[var(--success)]">
            Inquiry submitted. We&apos;ll be in touch shortly.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Submit inquiry"}
        </button>
      </form>
    </div>
  );
}
