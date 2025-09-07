import { NextRequest, NextResponse } from "next/server";
import { createBlob } from "@/lib/gists";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { id, filename } = await createBlob(payload);
    return NextResponse.json({ id, filename }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "create failed" }, { status: 500 });
  }
}
