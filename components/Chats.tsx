"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group"
import ReactMarkdown from "react-markdown"
import TextareaAutosize from "react-textarea-autosize"

export default function Chats() {
    const [isPDFUploaded, setIsPDFUploaded] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [name, setName] = useState("")
    const [message, setMessage]= useState("")
    const [chats, setChats] = useState([{
        role:"model",
        message:"Hello Now you can start asking about the uploaded document"
    },
    ])
    const [docname, setDocName] = useState("")

    const sendMessage = async () => {
        const trimmed = message.trim()
        if (!trimmed) return

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
                body: JSON.stringify({ messages: messagesPayload, query: trimmed, collectionName: docname }),
            })
            
            const data = await response.json()
            if (data.success && data.assistantMessage?.content) {
                setChats((prev) => [...prev, { role: "model", message: data.assistantMessage.content }])
            } else {
                setChats((prev) => [...prev, { role: "model", message: "Sorry, I couldn't get a response right now." }])
            }
        } catch (err) {
            console.error("Chat submission error", err)
            setChats((prev) => [...prev, { role: "model", message: "Error: could not connect to chat API." }])
        }
    }

    const sendOverview = async () => {
        if (!docname) return
        setChats((prev) => [...prev, { role: "user", message: "Please summarize this document." }])
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ overview: true, collectionName: docname, query: "overview" }),
            })
            const data = await response.json()
            if (data.success && data.assistantMessage?.content) {
                setChats((prev) => [...prev, { role: "model", message: data.assistantMessage.content }])
            } else {
                setChats((prev) => [...prev, { role: "model", message: "Sorry, I couldn't get an overview right now." }])
            }
        } catch (err) {
            console.error("Overview request error", err)
            setChats((prev) => [...prev, { role: "model", message: "Error: could not connect to overview API." }])
        }
    }


    const handleChange = async (e: any) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return
        setName("Processing File: " + selectedFile.name + "...")
        setFile(selectedFile)
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
                setIsPDFUploaded(true)
                let st = await JSON.parse(localStorage.getItem("pdfs") || "[]")
                if (!st) st = []
                st.push(data.colname)
                localStorage.setItem("pdfs", await JSON.stringify(st))
                setName("Upload Complete")
            }
        } catch (err) {
            console.log("Error Occured", err)
        }
    }

    if (!isPDFUploaded) {
        return (
            <div className='mx-auto flex h-full min-h-105 w-full  flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-6 text-center '>
                <div className='text-xl font-semibold'>Upload a PDF to start chatting</div>
                <div className='text-sm text-muted-foreground'>We will index your document and then answer your questions.</div>
                <label htmlFor='file' className='cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
                    Choose PDF
                </label>
                <input id='file' type='file' accept='.pdf' className='hidden' onChange={handleChange} />
                {name && <div className='mt-2 text-sm text-muted-foreground'>{name}</div>}
            </div>
        )
    }

    return (
        <div className='mx-auto flex h-full min-h-125 w-full flex-col rounded-2xl bg-card p-3 '>
            <div className='mb-2 flex items-center justify-between px-2'>
                <div>
                    <div className='text-lg font-semibold'>Chat with your PDF</div>
                    <p className='text-xs text-muted-foreground'>Ask your questions and get document-aware replies.</p>
                </div>
                <div className='text-xs text-muted-foreground'>{name}</div>
            </div>
            <div className='flex-1 overflow-y-auto rounded-xl border border-border bg-background p-3'>
                <div className='space-y-2'>
                    {chats.map((e, i) => (
                        <div key={i} className={`flex ${e.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${e.role === 'user' ? 'bg-blue-100 text-slate-900' : 'bg-emerald-100 text-slate-900'}`}>
                                <ReactMarkdown>{e.message}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mt-3 flex gap-2'>
                <TextareaAutosize
                    minRows={2}
                    className='flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary'
                    placeholder='Type your question...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={sendMessage} className='h-full cursor-pointer' disabled={!message.trim()}>
                    Send
                </Button>
                <Button variant='secondary' onClick={sendOverview} className='h-full cursor-pointer'>
                    Overview
                </Button>
            </div>
        </div>
    )
}