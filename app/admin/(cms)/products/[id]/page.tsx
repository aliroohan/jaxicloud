"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setProduct(data.product);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p className="text-slate-600">Loading…</p>;

  return <ProductForm initial={product} productId={product.id} />;
}
