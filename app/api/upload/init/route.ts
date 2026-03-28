export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { qdrantClient } from "@/lib/quadrant";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { fileName } = await req.json();
    if (!fileName || typeof fileName !== "string") {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 });
    }

    const collectionName = `pdf_chunks_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await qdrantClient.createCollection(collectionName, {
      vectors: { size: 384, distance: "Cosine" },
    });

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { name: session.user.name, image: session.user.image },
      create: { email: session.user.email, name: session.user.name, image: session.user.image },
    });

    const upload = await prisma.pdfUpload.create({
      data: {
        userId: user.id,
        fileName,
        collectionName,
      },
    });

    return NextResponse.json({ success: true, uploadId: upload.id, collectionName });
  } catch (err) {
    console.error("Upload init error", err);
    return NextResponse.json({ error: "Could not initialize upload" }, { status: 500 });
  }
}
