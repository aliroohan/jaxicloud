import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category, Product } from "@/lib/models";
import { serializeDoc, stripSupplierSource, toId } from "@/lib/api";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = request.nextUrl;
  const categorySlug = searchParams.get("category");
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");
  const status = searchParams.get("status") || "published";

  const filter: Record<string, unknown> = {};
  if (status !== "all") filter.status = status;

  if (categorySlug) {
    const category = await Category.findOne({ slug: categorySlug }).lean();
    if (!category) {
      return NextResponse.json({ products: [] });
    }
    filter.categoryId = category._id;
  }

  if (tag) filter.tags = tag;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { tagline: { $regex: q, $options: "i" } },
      { overview: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  const data = products.map((p) => {
    const serialized = stripSupplierSource(serializeDoc(p as Record<string, unknown>));
    const category = p.categoryId as unknown as { _id?: unknown; name?: string; slug?: string } | null;
    if (category && typeof category === "object" && "name" in category) {
      serialized.category = {
        id: toId(category._id as never),
        name: category.name,
        slug: category.slug,
      };
      serialized.categoryId = toId(category._id as never);
    } else {
      serialized.categoryId = toId(p.categoryId as never);
    }
    return serialized;
  });

  return NextResponse.json({ products: data });
}
