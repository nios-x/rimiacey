import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getEmbedding } from "@/lib/embeddings";
import { qdrantClient } from "@/lib/quadrant";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
}); 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const collectionName = body.collectionName;
    const isOverview = Boolean(body.overview);
    const query = typeof body.query === "string" && body.query.trim().length > 0 ? body.query.trim() : "overview";

    if (!collectionName || typeof collectionName !== "string") {
      return NextResponse.json({ error: "collectionName is required" }, { status: 400 });
    }

    const messagesArray = Array.isArray(body.messages) ? body.messages : [];

    const queryVector: any = await getEmbedding(query);
    const searchresult = await qdrantClient.search(collectionName, {
      vector: queryVector,
      limit: isOverview ? 10 : 3,
    });

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
            content: `Document chunks:\n${context}\n\nPlease provide a concise summary of the document content.`,
          },
        ],
      });

      const assistantMessage = response.choices?.[0]?.message;
      return NextResponse.json({ success: true, assistantMessage, raw: response });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable assistant. Use the document context below to answer the user's query and say 'I don't know.' if the answer is not in the document.`,
        },
        {
          role: "user",
          content: `Document context:\n${context}\n\nQuery:\n${query}`,
        },
        ...messagesArray,
      ],
    });

    const assistantMessage = response.choices?.[0]?.message;
    return NextResponse.json({ success: true, assistantMessage, raw: response });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json({ error: "Could not generate completion", details: String(error) }, { status: 500 });
  }
}
