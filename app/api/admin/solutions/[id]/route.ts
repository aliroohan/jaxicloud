import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Solution } from "@/lib/models";
import { solutionInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import { slugify } from "@/lib/slugify";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await connectDB();
  const solution = await Solution.findById(id).lean();
  if (!solution) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    solution: serializeDoc(solution as Record<string, unknown>),
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = solutionInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const data = parsed.data;
    const slug = data.slug?.trim() || slugify(data.name);
    const conflict = await Solution.findOne({ slug, _id: { $ne: id } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const solution = await Solution.findByIdAndUpdate(
      id,
      { ...data, slug },
      { new: true },
    ).lean();

    if (!solution) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      solution: serializeDoc(solution as Record<string, unknown>),
    });
  } catch (err) {
    console.error("admin solution update", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await connectDB();
  const solution = await Solution.findByIdAndDelete(id);
  if (!solution) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
