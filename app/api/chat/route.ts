import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getEmbedding } from "@/lib/embeddings";
import { qdrantClient } from "@/lib/quadrant";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || !user.geminiKey) {
      return NextResponse.json({ error: "Set your Gemini API key in settings before asking questions." }, { status: 400 });
    }
    const openai = createOpenAIClient(user.geminiKey);

    const body = await req.json();
    const collectionName = body.collectionName;
    const isOverview = Boolean(body.overview);
    const query = typeof body.query === "string" && body.query.trim().length > 0 ? body.query.trim() : "overview";
    const graph = body.graph;
    if (!collectionName || typeof collectionName !== "string") {
      return NextResponse.json({ error: "collectionName is required" }, { status: 400 });
    }

    const messagesArray = Array.isArray(body.messages) ? body.messages : [];
    const formattedHistory = messagesArray
      .filter((m: any) => m && typeof m.message === "string")
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.message,
      }));
    const reasoningMode = Boolean(body.reasoning);
    const reasoningStage = typeof body.reasoningStage === "number" ? body.reasoningStage : null;
    const stagePrompt = typeof body.stagePrompt === "string" ? body.stagePrompt : "";
    const queryVector: any = await getEmbedding(query);
    const searchresult = await qdrantClient.search(collectionName, {
      vector: queryVector,
      limit: isOverview ? 10 : 3,
    });
    console.log("Qdrant search results", searchresult);
    const contextChunks = searchresult
      .map((res: any) => typeof res.payload?.text === "string" ? res.payload.text : "")
      .filter(Boolean);

    if (!contextChunks.length) {
      return NextResponse.json({ error: "No document chunks found in the collection." }, { status: 404 });
    }

    const context = contextChunks.join("\n\n");
    if (isOverview) {
      const response = await openai.chat.completions.create({
        model: "gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable assistant. Summarize the content of the document chunks below accurately and concisely. Consider as big answer as possible, but do not add any information that is not present in the chunks.",
          },
          {
            role: "user",
            content: `Document chunks:\n${context}\n\nPlease provide a concise summary of the document content.  `,
          },
        ],
      });

      const assistantMessage = response.choices?.[0]?.message;
      return NextResponse.json({ success: true, assistantMessage, raw: response });
    }

    let systemPrompt: string
    let userContent: string
    if (reasoningMode && reasoningStage) {
      systemPrompt = `You are a knowledgeable assistant performing a 5-stage reasoning answer protocol. You MUST respond for the specified stage only. Stage: ${reasoningStage}/5. ${stagePrompt}`
      userContent = `Document context:\n${context}\n\nQuery:\n${query}\n\nStage ${reasoningStage}: ${stagePrompt}`
    } else {
      systemPrompt = reasoningMode
        ? `You are a knowledgeable assistant. Use the document context below to answer the user's query. Provide your reasoning in exactly 5 clear numbered steps, followed by a concise final answer. If the answer is not in the document, say 'I don't know.' and do not hallucinate. Graph visualization data (if any):\n${graph ? JSON.stringify(graph) : "No graph data provided."}`
        : `You are a knowledgeable assistant. Use the document context below to answer the user's query and say 'I don't know.' if the answer is not in the document. Graph visualization data (if any):\n${graph ? JSON.stringify(graph) : "No graph data provided."}`;
      userContent = `Document context:\n${context}\n\nQuery:\n${query}`
    }

    const response = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userContent,
        },
        ...formattedHistory,
      ],
    });

    const assistantMessage = response.choices?.[0]?.message;
    return NextResponse.json({ success: true, assistantMessage, raw: response });
  } catch (error: any) {
    console.error("Chat API error", error);
    const status = error?.status ?? error?.response?.status;
    if (status === 429) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment and try again.", details: String(error) },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: "Could not generate completion", details: String(error) }, { status: 500 });
  }
}
