export const runtime = "nodejs";

import "@/lib/pdfPolyfill";
import chunkText from "@/app/utils/chunker";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { getEmbedding } from "@/lib/embeddings";
import { qdrantClient } from "@/lib/quadrant";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ uploads: [] });
    }
    const uploads = await prisma.pdfUpload.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ uploads });
  } catch (err) {
    console.error("Upload list error", err);
    return NextResponse.json({ error: "Could not retrieve uploads" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing upload id" }, { status: 400 });

    const upload = await prisma.pdfUpload.findUnique({ where: { id } });
    if (!upload || upload.userId !== user.id) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    try {
      await qdrantClient.deleteCollection(upload.collectionName);
    } catch (err) {
      console.warn("Could not delete qdrant collection", err);
    }

    await prisma.pdfUpload.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete upload error", err);
    return NextResponse.json({ error: "Could not delete upload" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parser = new PDFParse({ data: buffer });
    const text = (await parser.getText()).text;
    const chunks = chunkText(text.replaceAll("\n", " "));
    const response = await Promise.all(chunks.map((e) => getEmbedding(e)));

    const colname = `pdf_chunks_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await qdrantClient.createCollection(colname, {
      vectors: { size: 384, distance: "Cosine" },
    });

    const points: any = response.map((vector, index) => ({
      id: index,
      vector: vector,
      payload: { text: chunks[index], file: file.name },
    }));
    await qdrantClient.upsert(colname, { points });

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { name: session.user.name, image: session.user.image },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    });

    const upload = await prisma.pdfUpload.create({
      data: {
        userId: user.id,
        fileName: file.name,
        collectionName: colname,
      },
    });

    return NextResponse.json({ success: true, file: file.name, collectionName: colname, uploadId: upload.id });
  } catch (err) {
    console.error("Upload error", err);
    return NextResponse.json({ error: "Upload failed", details: String(err) }, { status: 500 });
  }
}
