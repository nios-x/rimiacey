export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getEmbedding } from "@/lib/embeddings";
import { qdrantClient } from "@/lib/quadrant";

const BATCH_SIZE = 7;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const collectionName = body.collectionName as string;
    const uploadId = body.uploadId as string;
    const chunks = Array.isArray(body.chunks) ? body.chunks : [];
    const fileName = typeof body.fileName === "string" ? body.fileName : "upload.pdf";

    if (!collectionName || !uploadId) {
      return NextResponse.json({ error: "collectionName and uploadId are required" }, { status: 400 });
    }
    if (!chunks.length) {
      return NextResponse.json({ error: "No chunks provided" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const upload = await prisma.pdfUpload.findUnique({ where: { id: uploadId } });
    if (!upload || upload.userId !== user.id || upload.collectionName !== collectionName) {
      return NextResponse.json({ error: "Upload not found for this user" }, { status: 404 });
    }

    let inserted = 0;
    let counter = Date.now();

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const slice = chunks.slice(i, i + BATCH_SIZE).map((c: string) => (c || "").replaceAll("\n", " "));
      const vectors = await Promise.all(slice.map((c: string) => getEmbedding(c)));

      const points = vectors.map((vector, index) => ({
        id: counter + inserted + index,
        vector,
        payload: { text: slice[index], file: fileName },
      }));

      await qdrantClient.upsert(collectionName, { points });
      inserted += slice.length;
    }

    return NextResponse.json({ success: true, inserted });
  } catch (err) {
    console.error("Chunk ingest error", err);
    return NextResponse.json({ error: "Could not ingest chunks" }, { status: 500 });
  }
}
