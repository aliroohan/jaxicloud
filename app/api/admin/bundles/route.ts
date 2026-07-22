import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Bundle } from "@/lib/models";
import { bundleInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import { slugify } from "@/lib/slugify";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connectDB();
  const bundles = await Bundle.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({
    bundles: bundles.map((b) => serializeDoc(b as Record<string, unknown>)),
  });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = bundleInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const data = parsed.data;
    const slug = data.slug?.trim() || slugify(data.name);
    const existing = await Bundle.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const bundle = await Bundle.create({ ...data, slug });
    return NextResponse.json(
      { bundle: serializeDoc(bundle.toObject() as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (err) {
    console.error("admin bundle create", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
