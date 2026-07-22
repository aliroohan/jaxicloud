import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Product } from "@/lib/models";
import { productInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import { slugify } from "@/lib/slugify";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connectDB();
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q");
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (categoryId) filter.categoryId = categoryId;
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { modelNumber: { $regex: q, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .populate("categoryId", "name slug")
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({
    products: products.map((p) => {
      const serialized = serializeDoc(p as Record<string, unknown>);
      const category = p.categoryId as unknown as {
        _id?: { toString(): string };
        name?: string;
        slug?: string;
      } | null;
      if (category && typeof category === "object" && "name" in category) {
        serialized.category = {
          id: category._id?.toString(),
          name: category.name,
          slug: category.slug,
        };
        serialized.categoryId = category._id?.toString();
      }
      return serialized;
    }),
  });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = productInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const data = parsed.data;
    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const product = await Product.create({ ...data, slug });
    return NextResponse.json(
      { product: serializeDoc(product.toObject() as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (err) {
    console.error("admin product create", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
