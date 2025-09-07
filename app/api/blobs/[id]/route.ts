import { NextRequest, NextResponse } from "next/server";
import { readBlob, updateBlob, deleteBlob } from "@/lib/gists";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const doc = await readBlob(params.id);
    if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({
      id: doc.id,
      filename: doc.filename,
      data: doc.data,
    });
  } catch {
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await req.json();
    const updated = await updateBlob(params.id, payload);
    if (!updated)
      return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ id: updated.id, filename: updated.filename });
  } catch {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const ok = await deleteBlob(params.id);
    if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
