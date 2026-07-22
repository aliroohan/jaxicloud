"use client";

import Link from "next/link";
import { useInquiryStore } from "@/store/inquiry";

type Props = {
  id: string;
  name: string;
  slug: string;
  type?: "product" | "bundle";
  href?: string;
  className?: string;
  label?: string;
};

export function AddToInquiryButton({
  id,
  name,
  slug,
  type = "product",
  href,
  className = "",
  label = "Add to Inquiry",
}: Props) {
  const addItem = useInquiryStore((s) => s.addItem);
  const items = useInquiryStore((s) => s.items);
  const inCart = items.some((i) => i.id === id && i.type === type);

  return (
    <button
      type="button"
      onClick={() => addItem({ id, name, slug, type, href })}
      className={`rounded-md border border-accent bg-accent-soft px-4 py-2 text-sm font-medium text-accent-dark transition hover:bg-accent hover:text-white ${className}`}
    >
      {inCart ? "Added · Add another" : label}
    </button>
  );
}

export function RequestQuoteLink({
  href = "/inquiry",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dark ${className}`}
    >
      Request Quote
    </Link>
  );
}
