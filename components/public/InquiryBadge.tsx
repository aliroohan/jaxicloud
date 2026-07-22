"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useInquiryStore } from "@/store/inquiry";

export function InquiryBadge() {
  const items = useInquiryStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted
    ? items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  return (
    <Link
      href="/inquiry"
      className="relative rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-navy transition hover:border-accent"
    >
      Inquiry
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
