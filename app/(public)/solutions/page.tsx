import Link from "next/link";
import type { Metadata } from "next";
import { getSolutions } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Solutions",
  description: "Industry solutions for transit, logistics, and school transport.",
};

export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl text-navy">Solutions</h1>
      <p className="mt-2 text-muted">
        Industry-focused product sets for common fleet deployments.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {solutions.map((s) => (
          <Link
            key={s.id}
            href={`/solutions/${s.slug}`}
            className="rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
          >
            <h2 className="font-display text-2xl text-navy">{s.name}</h2>
            <p className="mt-3 text-sm text-muted">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
