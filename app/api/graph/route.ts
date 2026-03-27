import { NextResponse } from "next/server";
import neo4j from "neo4j-driver";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

export async function GET(req: Request) {
  const sessionAuth = await getServerSession(authOptions);
  if (!sessionAuth?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: sessionAuth.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const driver = createNeo4jDriver();
  const session = driver.session();

  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId required" },
        { status: 400 }
      );
    }
    const upload = await prisma.pdfUpload.findFirst({
      where: { collectionName: projectId, userId: user.id },
    });
    if (!upload) {
      return NextResponse.json({ error: "Collection not found for this user." }, { status: 404 });
    }

    const result = await session.run(
      `
      MATCH (p:Project {id: $projectId})-[:HAS_ENTITY]->(a:Entity)
      OPTIONAL MATCH (a)-[r]->(b:Entity)
      WHERE (p)-[:HAS_ENTITY]->(b)
      RETURN a, r, b
      LIMIT 200
      `,
      { projectId }
    );
    console.log(result)
    const nodes = new Map();
    const edges:any[] = [];

    result.records.forEach((record) => {
      const a = record.get("a");
      const b = record.get("b");
      const r = record.get("r");

      if (a) {
        nodes.set(a.properties.name, {
          id: a.properties.name,
          label: a.properties.name,
        });
      }

      if (b) {
        nodes.set(b.properties.name, {
          id: b.properties.name,
          label: b.properties.name,
        });
      }

      if (r && a && b) {
        edges.push({
          source: a.properties.name,
          target: b.properties.name,
          label: r.type,
        });
      }
    });

    return NextResponse.json({
      nodes: Array.from(nodes.values()),
      edges,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch graph" },
      { status: 500 }
    );
  } finally {
    await session.close();
    await driver.close();
  }
}
