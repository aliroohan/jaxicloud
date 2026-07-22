import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Solution } from "@/lib/models";
import { solutionInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import { slugify } from "@/lib/slugify";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connectDB();
  const solutions = await Solution.find().sort({ name: 1 }).lean();
  return NextResponse.json({
    solutions: solutions.map((s) =>
      serializeDoc(s as Record<string, unknown>),
    ),
  });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
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
    const existing = await Solution.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const solution = await Solution.create({ ...data, slug });
    return NextResponse.json(
      { solution: serializeDoc(solution.toObject() as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (err) {
    console.error("admin solution create", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
