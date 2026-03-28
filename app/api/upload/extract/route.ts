export const runtime = "nodejs";

import "@/lib/canvasGlobals";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { extractPdfPageRange } from "@/lib/pdfText";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const start = Number(formData.get("start"));
    const end = formData.get("end") ? Number(formData.get("end")) : undefined;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 413 });
    }

    if (!Number.isFinite(start) || start < 1) {
      return NextResponse.json({ error: "start page is required" }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const { totalPages, pages } = await extractPdfPageRange(bytes, start, end);

    return NextResponse.json({ success: true, totalPages, pages });
  } catch (err) {
    console.error("Page extract error", err);
    return NextResponse.json({ error: "Could not extract pages" }, { status: 500 });
  }
}
