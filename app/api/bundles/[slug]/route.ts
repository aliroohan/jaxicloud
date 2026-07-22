import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bundle, Product } from "@/lib/models";
import { serializeDoc, stripSupplierSource, toId } from "@/lib/api";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  await connectDB();

  const bundle = await Bundle.findOne({ slug, status: "published" }).lean();
  if (!bundle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const products = await Product.find({
    _id: { $in: bundle.productIds || [] },
    status: "published",
  })
    .populate("categoryId", "name slug")
    .lean();

  const serialized = serializeDoc(bundle as Record<string, unknown>);
  serialized.products = products.map((p) => {
    const item = stripSupplierSource(serializeDoc(p as Record<string, unknown>));
    const category = p.categoryId as unknown as {
      _id?: unknown;
      name?: string;
      slug?: string;
    } | null;
    if (category && typeof category === "object" && "slug" in category) {
      item.category = {
        id: toId(category._id as never),
        name: category.name,
        slug: category.slug,
      };
    }
    return item;
  });

  return NextResponse.json({ bundle: serialized });
}
