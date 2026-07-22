import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bundle, Category, Product, Solution } from "@/lib/models";
import { serializeDoc, stripSupplierSource, toId } from "@/lib/api";

export const revalidate = 3600;

type Params = { params: Promise<{ category: string; slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { category: categorySlug, slug } = await params;
  await connectDB();

  const category = await Category.findOne({ slug: categorySlug }).lean();
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const product = await Product.findOne({
    slug,
    categoryId: category._id,
    status: "published",
  }).lean();

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [solutions, bundles] = await Promise.all([
    Solution.find({
      _id: { $in: product.solutionIds || [] },
    }).lean(),
    Bundle.find({
      status: "published",
      productIds: product._id,
    }).lean(),
  ]);

  const serialized = stripSupplierSource(
    serializeDoc(product as Record<string, unknown>),
  );
  serialized.category = {
    id: toId(category._id),
    name: category.name,
    slug: category.slug,
  };
  serialized.categoryId = toId(category._id);
  serialized.solutions = solutions.map((s) =>
    serializeDoc(s as Record<string, unknown>),
  );
  serialized.bundles = bundles.map((b) =>
    serializeDoc(b as Record<string, unknown>),
  );

  return NextResponse.json({ product: serialized });
}
