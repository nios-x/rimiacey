import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        image: user.image,
        geminiKey: !!user.geminiKey,
      },
    });
  } catch (err) {
    console.error("GET /api/user error", err);
    return NextResponse.json({ error: "Could not load user" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const body = await req.json();
    const geminiKey = typeof body.geminiKey === "string" ? body.geminiKey.trim() : "";
    if (!geminiKey) {
      return NextResponse.json({ error: "geminiKey is required" }, { status: 400 });
    }
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: { geminiKey },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        geminiKey,
      },
    });
    return NextResponse.json({ success: true, user: { email: user.email, geminiKey: !!user.geminiKey } });
  } catch (err) {
    console.error("POST /api/user error", err);
    return NextResponse.json(
      { error: "Could not save key", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
