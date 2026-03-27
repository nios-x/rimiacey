import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getEmbedding } from "@/lib/embeddings";
import { qdrantClient } from "@/lib/quadrant";
import neo4j from "neo4j-driver";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 2) {
    let attempt = 0;
    let lastError: unknown;
    while (attempt <= retries) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            const status = error?.status ?? error?.response?.status;
            if ((status !== 429 && status !== 503) || attempt === retries) break;
            const backoff = 500 * Math.pow(2, attempt);
            await sleep(backoff);
        }
        attempt += 1;
    }
    throw lastError;
}

function createNeo4jDriver() {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
        throw new Error("Missing Neo4j config. Set NEO4J_URI, NEO4J_USER, and NEO4J_PASSWORD in .env");
    }

    if (!/^neo4j(s|\+s)?:\/\//.test(uri) && !/^bolt(s|\+s)?:\/\//.test(uri)) {
        throw new Error(`Invalid Neo4j URI scheme: ${uri}. Expected neo4j://, neo4j+s://, bolt://, or bolt+s://`);
    }

    return neo4j.driver(uri, neo4j.auth.basic(user, password));
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || !user.geminiKey) {
            return NextResponse.json({ error: "Set your Gemini API key in settings." }, { status: 400 });
        }
        const openai = createOpenAIClient(user.geminiKey);

        const body = await req.json();
        const collectionName = body.collectionName;
        const overview = body.overview;
        if (!collectionName || typeof collectionName !== "string") {
            return NextResponse.json({ error: "collectionName is required" }, { status: 400 });
        }
        const upload = await prisma.pdfUpload.findFirst({
            where: { collectionName, userId: user.id },
        });
        if (!upload) {
            return NextResponse.json({ error: "Collection not found for this user." }, { status: 404 });
        }
        const queryVector: any = await getEmbedding(overview);
        const searchresult = await qdrantClient.search(collectionName, {
            vector: queryVector,
            limit: 10,
        });
        console.log("Qdrant search results", searchresult);
        const contextChunks = searchresult
            .map((res: any) => typeof res.payload?.text === "string" ? res.payload.text : "")
            .filter(Boolean);

        if (!contextChunks.length) {
            return NextResponse.json({ error: "No document chunks found in the collection." }, { status: 404 });
        }

        const context = contextChunks.join("\n\n");
        const messagesArray = Array.isArray(body.messages) ? body.messages : [];
        console.log(context)
        const response = await withRetry(() => openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: `
You are an expert knowledge graph builder that generates Cypher queries for Neo4j.

STRICT RULES:
- Output ONLY Cypher queries
- No explanations
- No markdown
- No comments
- One query per line
- Always use MERGE (never CREATE)

NODE RULES:
- All nodes must include a "name" property
- Use label :Entity for entities
- Use label :Project for the project node
- The project node must include both {id, name}

RELATIONSHIP RULES:
- Every entity must be connected to the project
- Use: (p)-[:HAS_ENTITY]->(entity)
- Relationships must be between Entity nodes

VARIABLE RULES:
- Do NOT reuse temporary variables across queries
- Always MATCH nodes again before creating relationships
- Never assume a variable exists from a previous query

CORRECT PATTERN:

MERGE (p:Project {id:"project_id", name:"Project Name"})

MERGE (:Entity {name:"Reduced resolution"})
MERGE (:Entity {name:"Image processing"})

MATCH (p:Project {id:"project_id"})
MATCH (a:Entity {name:"Reduced resolution"})
MERGE (p)-[:HAS_ENTITY]->(a)

MATCH (p:Project {id:"project_id"})
MATCH (b:Entity {name:"Image processing"})
MERGE (p)-[:HAS_ENTITY]->(b)

MATCH (a:Entity {name:"Reduced resolution"})
MATCH (b:Entity {name:"Image processing"})
MERGE (a)-[:USED_IN]->(b)
`
                },
                {
                    role: "user",
                    content: `
Project ID:
${collectionName}

Document Chunks:
${context}

Overview:
${overview}

Conversation:
${messagesArray.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}

Generate Cypher queries for this project.
`
                }
            ]
        }));

        const assistantMessage = response.choices?.[0]?.message;
        console.log(assistantMessage)
        const queries = assistantMessage?.content?.split("\n") || [];
        const projectId = collectionName;
        const projectName = collectionName;
        const safeProjectIdDouble = projectId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const safeProjectIdSingle = projectId.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        const safeProjectNameDouble = projectName.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const safeProjectNameSingle = projectName.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
        const normalizedQueries = queries.map((query) =>
            query
                .replace(/"project_id"/g, `"${safeProjectIdDouble}"`)
                .replace(/'project_id'/g, `'${safeProjectIdSingle}'`)
                .replace(/id:\s*project_id\b/g, `id: "${safeProjectIdDouble}"`)
                .replace(/"Project Name"/g, `"${safeProjectNameDouble}"`)
                .replace(/'Project Name'/g, `'${safeProjectNameSingle}'`)
                .replace(/name:\s*Project Name\b/g, `name: "${safeProjectNameDouble}"`)
        );
        const entityNames = new Set<string>();
        const entityRegex = /:Entity\s*\{\s*name\s*:\s*(?:"([^"]+)"|'([^']+)')\s*\}/g;
        for (const query of normalizedQueries) {
            let match: RegExpExecArray | null;
            while ((match = entityRegex.exec(query)) !== null) {
                const name = match[1] ?? match[2];
                if (name && name.trim()) {
                    entityNames.add(name.trim());
                }
            }
        }
        const driver = createNeo4jDriver();
        const driverSession = driver.session();

        try {
            await driverSession.run(
                "MERGE (p:Project {id: $id, name: $name})",
                { id: projectId, name: projectName }
            );
            for (const name of entityNames) {
                await driverSession.run(
                    "MERGE (e:Entity {name: $name}) WITH e MATCH (p:Project {id: $id}) MERGE (p)-[:HAS_ENTITY]->(e)",
                    { id: projectId, name }
                );
            }
            for (const query of normalizedQueries) {
                const trimmed = query.trim();
                if (!trimmed || trimmed.startsWith("```")) {
                    continue;
                }
                await driverSession.run(trimmed);
                }
        } finally {
            await driverSession.close();
            await driver.close();
        }

        return NextResponse.json({ success: true, assistantMessage });
    } catch (error: any) {
        console.error("Chat API error", error);
        const status = error?.status ?? error?.response?.status;
        if (status === 429) {
            return NextResponse.json(
                { error: "Rate limit reached. Please wait a moment and try again.", details: String(error) },
                { status: 429 }
            );
        }
        if (status === 503) {
            return NextResponse.json(
                { error: "Upstream model service unavailable. Please try again shortly.", details: String(error) },
                { status: 503 }
            );
        }
        return NextResponse.json({ error: "Could not generate completion", details: String(error) }, { status: 500 });
    }
}
