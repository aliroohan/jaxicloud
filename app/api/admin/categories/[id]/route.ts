import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Category } from "@/lib/models";
import { categoryInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import { slugify } from "@/lib/slugify";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = categoryInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const data = parsed.data;
    const slug = data.slug?.trim() || slugify(data.name);
    const conflict = await Category.findOne({ slug, _id: { $ne: id } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { ...data, slug },
      { new: true },
    ).lean();

    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      category: serializeDoc(category as Record<string, unknown>),
    });
  } catch (err) {
    console.error("admin category update", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await connectDB();
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
