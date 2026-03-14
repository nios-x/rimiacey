import chunkText from "@/app/utils/chunker";
import { NextResponse } from "next/server"
import pdf from "pdf-parse-new";
import { getEmbedding } from "@/lib/embeddings";
import { qdrantClient } from "@/lib/quadrant";

export async function POST(req: Request) {
    const formData = await req.formData()
    const file = formData.get("file") as File
    if(!file){
        return NextResponse.json({error:"No file uploaded"})
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const parser = await pdf(buffer)
    const text = parser.text
    const chunks = chunkText(text.replaceAll("\n", " "))
    const response= await Promise.all(chunks.slice(0,1).map(e=>getEmbedding(e)))
    const y = Math.random().toString()
    const colname = "pdf_chunks-"+y+"-"+file.name
    await qdrantClient.createCollection(colname, {
        vectors: {
            size: 384, 
            distance: "Cosine"
        }
    })  


    const points:any = response.map((vector, index) => ({
        id: index,
        vector: vector,
        payload: {
            text: chunks[index],
            file: file.name
        }
    }))

    await qdrantClient.upsert(colname, {
        points
    })


    return NextResponse.json({
        success:true,
        file:file.name,
        colname
    })
}