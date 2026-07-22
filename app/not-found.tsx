import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="mt-3 font-display text-4xl text-navy">Page not found</h1>
      <p className="mt-3 text-muted">
        That page is not in the Jaxicloud catalog. Try products or solutions
        instead.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Home
        </Link>
        <Link
          href="/products"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium"
        >
          Products
        </Link>
      </div>
    </div>
  );
}
