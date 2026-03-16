"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import ReactMarkdown from "react-markdown"
import TextareaAutosize from "react-textarea-autosize"
import { Network } from "vis-network"

export default function Chats() {
    type ChatMessage = { role: "user" | "model"; message: string }
    type GraphNode = { id: string | number; label: string }
    type GraphEdge = { source: string | number; target: string | number; label: string }
    type GraphState = { nodes: GraphNode[]; edges: GraphEdge[] }

    const [isPDFUploaded, setIsPDFUploaded] = useState(false)
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [streamedToBeMsg, setStreamedToBeMsg] = useState("")
    const [streamedMessage, setStreamedMessage] = useState("")
    const [overview, setOverView] = useState("")
    const [graph, setGraph] = useState<GraphState>({ nodes: [], edges: [] })
    const [relationOpen, setRelationOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState("")
    const [recentDocs, setRecentDocs] = useState<string[]>([])
    const [selectedDoc, setSelectedDoc] = useState<string>("")
    const networkRef = useRef<Network | null>(null)

    useEffect(() => {
        if (!relationOpen || !graph) return

        const container = document.getElementById("graph")
        if (!container) return

        // Transform edges from {source, target, label} -> {from, to, label}
        const data = {
            nodes: graph.nodes.map((n) => ({ id: n.id, label: n.label })),
            edges: graph.edges.map((e) => ({
                from: e.source,
                to: e.target,
                label: e.label.length > 8 ? e.label.slice(0, 30) + "..." : e.label,
                font: { size: 8, align: "middle", color: "#555" }
            })),
        }

        const options = {
            layout: { improvedLayout: true },
            nodes: { shape: "dot", size: 10, font: { size: 8 } },
            edges: { arrows: { to: true }, smooth: true },
            physics: { enabled: true },
        }

        if (networkRef.current) {
            networkRef.current.destroy()
            networkRef.current = null
        }

        networkRef.current = new Network(container, data, options)

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy()
                networkRef.current = null
            }
        }
    }, [graph, relationOpen])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("pdfs") || "[]")
        if (Array.isArray(stored) && stored.length > 0) {
            setRecentDocs(stored)
            setSelectedDoc(stored[0])
            setDocName(stored[0])
            setIsPDFUploaded(true)
        }
    }, [])

    const fetchGraph = async () => {
        if (!docname) {
            setError("Select a document collection first")
            return
        }

        setError("")
        setIsProcessing(true)
        try {
            const res = await fetch(`/api/graph?projectId=${docname}`)
            const data = await res.json()
            if (data.error) {
                setError(data.error)
                return
            }
            setGraph(data)
            setRelationOpen(true)
        } catch (err) {
            setError("Could not fetch graph")
        } finally {
            setIsProcessing(false)
        }
    }

    const sendAnalyse = async () => {
        if (!docname) return
        if (!overview) return

        setError("")
        setIsProcessing(true)

        try {
            const response = await fetch("/api/analyse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ overview, collectionName: docname, messages: chats }),
            })
            const data = await response.json()
            if (data.success && data.assistantMessage?.content) {
                setGraph(data.assistantMessage.content)
            } else {
                setError(data.error || "Could not generate analysis")
                setChats((prev) => [...prev, { role: "model", message: "Sorry, I couldn't get an overview right now." }])
            }
        } catch (err) {
            console.error("Analyse request error", err)
            setError("Analyse request failed")
            setChats((prev) => [...prev, { role: "model", message: "Error: Analyse request failed." }])
        } finally {
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const streamer = async () => {
            for (let i = 0; i < streamedToBeMsg.length; i++) {
                setStreamedMessage(streamedToBeMsg.substring(0, i + 1))
                await sleep(5)
            }
        }
        streamer()
    }, [streamedToBeMsg])

    const [chats, setChats] = useState<ChatMessage[]>([
        {
            role: "model",
            message: "Hello! Upload a PDF, then ask anything about it."
        }
    ])
    const [docname, setDocName] = useState("")
    useEffect(() => {
        const last = chats[chats.length - 1]
        if (last?.role === "model") {
            setStreamedMessage("")
            setStreamedToBeMsg(last.message)
        }
    }, [chats])
    const sendMessage = async () => {
        const trimmed = message.trim()
        if (!trimmed) {
            setError("Type a question to send.")
            return
        }
        if (!docname) {
            setError("Upload a PDF first.")
            return
        }
        setError("")
        setIsProcessing(true)

        const userMessage = { role: "user", message: trimmed }
        const updatedChats = [...chats, userMessage]
        setChats(updatedChats)
        setMessage("")

        try {
            const messagesPayload = [
                ...updatedChats.slice(-5).map((chat) => ({
                    role: chat.role === "user" ? "user" : "assistant",
                    content: chat.message,
                })),
            ]

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: messagesPayload, query: trimmed, collectionName: docname, graph }),
            })

            const data = await response.json()
            if (data.success && data.assistantMessage?.content) {
                setChats((prev) => [...prev, { role: "model", message: data.assistantMessage.content }])
            } else {
                setChats((prev) => [...prev, { role: "model", message: data.error || "Sorry, I couldn't get a response right now." }])
            }
        } catch (err) {
            console.error("Chat submission error", err)
            setChats((prev) => [...prev, { role: "model", message: "Error: could not connect to chat API." }])
        } finally {
            setIsProcessing(false)
        }
    }
    const sendOverview = async () => {
        if (!docname) {
            setError("Upload a PDF first")
            return
        }
        setChats((prev) => [...prev, { role: "user", message: "Please summarize this document." }])
        setError("")
        setIsProcessing(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ overview: true, collectionName: docname, query: "overview" }),
            })
            const data = await response.json()
            if (data.success && data.assistantMessage?.content) {
                setOverView(data.assistantMessage.content)
                setChats((prev) => [...prev, { role: "model", message: data.assistantMessage.content }])
                await sendAnalyse()
            } else {
                const message = data.error || "Sorry, I couldn't get an overview right now."
                setChats((prev) => [...prev, { role: "model", message }])
                setError(message)
            }
        } catch (err) {
            console.error("Overview request error", err)
            setChats((prev) => [...prev, { role: "model", message: "Error: could not connect to overview API." }])
            setError("Overview request failed")
        } finally {
            setIsProcessing(false)
        }
    }
    const handleChange = async (e: any) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setError("")
        setIsUploading(true)
        setName("Processing File: " + selectedFile.name + "...")

        const formData = new FormData()
        formData.append("file", selectedFile)
        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })
            const data = await response.json()
            if (data.success) {
                setDocName(data.colname)
                setSelectedDoc(data.colname)
                setIsPDFUploaded(true)
                const stored = JSON.parse(localStorage.getItem("pdfs") || "[]")
                const docs = Array.isArray(stored) ? [data.colname, ...stored.filter((x: string) => x !== data.colname)] : [data.colname]
                localStorage.setItem("pdfs", JSON.stringify(docs))
                setRecentDocs(docs)
                setName("Upload Complete")
            } else {
                setError(data.error || "Upload failed")
                setName("Upload failed")
            }
        } catch (err) {
            console.error("Error Occured", err)
            setError("Upload failed")
            setName("Upload failed")
        } finally {
            setIsUploading(false)
        }
    }
    if (!isPDFUploaded) {
        return (
            <div className='mx-auto flex h-full min-h-105 w-full flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-[radial-gradient(circle_at_top,#ffffff_0%,#fff1e6_100%)] p-8 text-center shadow-sm'>
                <div className='text-xl font-semibold'>Upload a PDF to start chatting</div>
                <div className='text-sm text-muted-foreground'>We will index your document and then answer your questions.</div>

                {recentDocs.length > 0 && (
                    <div className='mt-2 text-left text-sm'>
                        <div className='font-semibold'>Recent collections</div>
                        <div className='mt-1 flex flex-wrap gap-2'>
                            {recentDocs.map((doc) => (
                                <button
                                    key={doc}
                                    onClick={() => {
                                        setDocName(doc)
                                        setIsPDFUploaded(true)
                                        setSelectedDoc(doc)
                                        setName(`Using saved collection: ${doc}`)
                                    }}
                                    className={`rounded-full border border-border px-3 py-1 text-xs transition ${
                                        selectedDoc === doc ? "bg-foreground text-background" : "hover:bg-muted"
                                    }`}
                                >
                                    {doc}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <label htmlFor='file' className='cursor-pointer rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90'>
                    {isUploading ? "Uploading..." : "Choose PDF"}
                </label>
                <input id='file' type='file' accept='.pdf' className='hidden' onChange={handleChange} disabled={isUploading} />
                {name && <div className='mt-2 text-sm text-muted-foreground'>{name}</div>}
                {error && <div className='mt-1 text-xs text-red-600'>{error}</div>}
            </div>
        )
    }

    return (
        <>
            <div className='mx-auto flex h-full min-h-125 w-full flex-col rounded-3xl border border-border bg-white/70 p-3 shadow-sm'>
                {relationOpen && (
                    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-6'>
                        <div className='relative h-[80%] w-full max-w-5xl rounded-2xl border border-white/60 bg-white p-6 shadow-2xl'>
                            <Button
                                className='absolute right-4 top-4 rounded-full bg-foreground px-4 text-background hover:bg-foreground/90'
                                onClick={() => setRelationOpen(false)}
                            >
                                Close
                            </Button>
                            <div id="graph" className="h-full w-full" />
                        </div>
                    </div>
                )}
                <div className='mb-2 flex flex-wrap items-end justify-between gap-2 px-2'>
                    <div>
                        <div className='text-lg font-semibold'>Chat with your PDF</div>
                        <p className='text-xs text-muted-foreground'>Ask questions and get document-aware replies.</p>
                        {docname && <p className='text-xs text-primary'>Current collection: {docname}</p>}
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <span>{name || "Ready"}</span>
                        {isProcessing && <span className='rounded-full bg-foreground/10 px-2 py-0.5 text-[11px]'>Working...</span>}
                    </div>
                </div>                {error && <div className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700'>{error}</div>}                <div className='flex-1 overflow-y-auto rounded-2xl border border-border bg-white p-4 shadow-inner'>
                    <div className='space-y-3'>
                        {chats.map((e, i) => {
                            const isUser = e.role === "user"
                            const isLast = i === chats.length - 1
                            const content = !isUser && isLast ? streamedMessage : e.message
                            return (
                                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${isUser ? 'bg-foreground text-background' : 'bg-emerald-50 text-slate-900'}`}>
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='mt-3 flex flex-wrap gap-2'>
                    <TextareaAutosize
                        minRows={2}
                        className='min-w-[220px] flex-1 resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-foreground'
                        placeholder='Type your question...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button onClick={sendMessage} className='h-full rounded-full px-6' disabled={!message.trim() || isProcessing}>
                        {isProcessing ? "Sending..." : "Send"}
                    </Button>
                    <Button variant='secondary' onClick={sendOverview} className='h-full rounded-full px-4' disabled={isProcessing || !docname}>
                        {isProcessing ? "Working..." : "Overview"}
                    </Button>
                    <Button
                        variant='secondary'
                        onClick={fetchGraph}
                        className='h-full rounded-full px-4'
                        disabled={!overview.length || isProcessing}
                    >
                        {isProcessing ? "Loading..." : "Relationship"}
                    </Button>
                </div>
                {error && <div className='mt-2 px-2 text-xs text-red-600'>{error}</div>}
            </div>
        </>
    )
}
