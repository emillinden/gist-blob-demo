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
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "read failed" },
      { status: 500 },
    );
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
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "update failed" },
      { status: 500 },
    );
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
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "delete failed" },
      { status: 500 },
    );
  }
}
