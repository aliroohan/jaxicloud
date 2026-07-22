import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Inquiry } from "@/lib/models";
import { serializeDoc } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await connectDB();
  const inquiry = await Inquiry.findById(id).lean();
  if (!inquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    inquiry: serializeDoc(inquiry as Record<string, unknown>),
  });
}

const patchSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

export async function PATCH(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true },
    ).lean();

    if (!inquiry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      inquiry: serializeDoc(inquiry as Record<string, unknown>),
    });
  } catch (err) {
    console.error("admin inquiry patch", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
