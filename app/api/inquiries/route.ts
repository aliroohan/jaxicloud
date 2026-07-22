import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Inquiry } from "@/lib/models";
import { inquiryInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquiryInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid inquiry", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const inquiry = await Inquiry.create({
      ...parsed.data,
      status: "new",
    });

    return NextResponse.json(
      { inquiry: serializeDoc(inquiry.toObject() as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (error) {
    console.error("inquiry create error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
