"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { Network } from "vis-network";

type UploadItem = { id: string; fileName: string; collectionName: string; createdAt: string };

type ChatsProps = {
  uploads?: UploadItem[];
  setUploads?: React.Dispatch<React.SetStateAction<UploadItem[]>>;
  selectedDoc?: string;
  setSelectedDoc?: React.Dispatch<React.SetStateAction<string>>;
};

export default function Chats({
  uploads: uploadsProp,
  setUploads: setUploadsProp,
  selectedDoc: selectedDocProp,
  setSelectedDoc: setSelectedDocProp,
}: ChatsProps) {
  type ChatMessage = { role: "user" | "model"; message: string };
  type GraphNode = { id: string | number; label: string };
  type GraphEdge = { source: string | number; target: string | number; label: string };
  type GraphState = { nodes: GraphNode[]; edges: GraphEdge[] };

  const [isPDFUploaded, setIsPDFUploaded] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [streamedToBeMsg, setStreamedToBeMsg] = useState("");
  const [streamedMessage, setStreamedMessage] = useState("");
  const [overview, setOverView] = useState("");
  const [graph, setGraph] = useState<GraphState>({ nodes: [], edges: [] });
  const [relationOpen, setRelationOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reasoningInProgress, setReasoningInProgress] = useState(false);
  const [reasoningStage, setReasoningStage] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [recentDocsInternal, setRecentDocsInternal] = useState<UploadItem[]>([]);
  const [docnameInternal, setDocNameInternal] = useState("");
  const recentDocs = uploadsProp ?? recentDocsInternal;
  const setRecentDocs = setUploadsProp ?? setRecentDocsInternal;
  const docname = selectedDocProp ?? docnameInternal;
  const setDocName = setSelectedDocProp ?? setDocNameInternal;
  const networkRef = useRef<Network | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!relationOpen || !graph) return;

    const container = document.getElementById("graph");
    if (!container) return;

    const data:any = {
      nodes: graph.nodes.map((n) => ({ id: n.id, label: n.label })),
      edges: graph.edges.map((e) => ({
        from: e.source,
        to: e.target,
        label: e.label.length > 8 ? e.label.slice(0, 36) + "..." : e.label,
        font: { size: 10, align: "middle", color: "#4b5563", face: "var(--font-geist-sans)" },
        color: { color: "#cbd5e1", highlight: "#0f766e", hover: "#0f766e" },
        width: 1.2,
        smooth: { type: "dynamic" },
      })),
    };

    const options = {
      layout: { improvedLayout: true, randomSeed: 7 },
      nodes: {
        shape: "dot",
        size: 12,
        borderWidth: 2,
        color: {
          background: "#e0f2fe",
          border: "#0284c7",
          highlight: { background: "#a7f3d0", border: "#0f766e" },
          hover: { background: "#bae6fd", border: "#0ea5e9" },
        },
        font: { size: 12, color: "#0f172a", face: "var(--font-geist-sans)" },
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        smooth: true,
        selectionWidth: 2,
      },
      physics: { enabled: true, stabilization: { iterations: 180 } },
      interaction: { hover: true, tooltipDelay: 120, zoomView: true },
    };

    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }

    networkRef.current = new Network(container, data, options);

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graph, relationOpen]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userRes = await fetch("/api/user");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.user?.geminiKey) {
            setHasKey(true);
          }
        }
      } catch (err) {
        console.error("Could not load user", err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (uploadsProp) {
      if (uploadsProp.length) {
        setIsPDFUploaded(true);
        if (!docname) {
          setDocName(uploadsProp[0].collectionName);
          setName(uploadsProp[0].fileName);
        } else {
          const current = uploadsProp.find((u) => u.collectionName === docname);
          if (current) setName(current.fileName);
        }
      } else {
        setIsPDFUploaded(false);
        if (docname) {
          setDocName("");
        }
      }
      return;
    }
    const loadUploads = async () => {
      try {
        const uploadRes = await fetch("/api/upload");
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.uploads?.length) {
            setRecentDocs(uploadData.uploads);
            setDocName(uploadData.uploads[0].collectionName);
            setName(uploadData.uploads[0].fileName);
            setIsPDFUploaded(true);
          }
        }
      } catch (err) {
        console.error("Could not load uploads", err);
      }
    };
    loadUploads();
  }, [uploadsProp, docname, setDocName, setRecentDocs]);

  const fetchGraph = async () => {
    if (!docname) {
      setError("Select a document collection first");
      return;
    }

    const requestedDoc = docname;
    setError("");
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/graph?projectId=${requestedDoc}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      if (requestedDoc !== docname) {
        return;
      }
      setGraph(data);
      if (!data?.nodes?.length) {
        setError("No graph data yet. Run Overview to generate relationships.");
        return;
      }
      setRelationOpen(true);
    } catch (err) {
      setError("Could not fetch graph");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendAnalyse = async () => {
    if (!docname) return;
    if (!overview) return;

    setError("");
    setIsProcessing(true);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overview, collectionName: docname, messages: chats }),
      });
      const data = await response.json();
      if (data.success && data.assistantMessage?.content) {
        // Graph data is stored in Neo4j; fetch it when the user opens Relationships.
      } else {
        setError(data.error || "Could not generate analysis");
        setChats((prev) => [
          ...prev,
          { role: "model", message: "Sorry, I couldn't get an overview right now." },
        ]);
      }
    } catch (err) {
      console.error("Analyse request error", err);
      setError("Analyse request failed");
      setChats((prev) => [
        ...prev,
        { role: "model", message: "Error: Analyse request failed." },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const streamer = async () => {
      for (let i = 0; i < streamedToBeMsg.length; i++) {
        setStreamedMessage(streamedToBeMsg.substring(0, i + 1));
        await sleep(5);
      }
    };
    streamer();
  }, [streamedToBeMsg]);

  const [chats, setChats] = useState<ChatMessage[]>([
    {
      role: "model",
      message: "Hello! Upload a PDF, then ask anything about it.",
    },
  ]);
  useEffect(() => {
    const last = chats[chats.length - 1];
    if (last?.role === "model") {
      setStreamedMessage("");
      setStreamedToBeMsg(last.message);
    }
  }, [chats]);
  const sendMessage = async (reasoning = false) => {
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Type a question to send.");
      return;
    }
    if (!hasKey) {
      setError("Please enter your Gemini API key in settings before asking.");
      return;
    }
    if (!docname) {
      setError("Upload a PDF first.");
      return;
    }
    setError("");
    setIsProcessing(true);

    const userMessage: ChatMessage = { role: "user", message: trimmed };
    const updatedChats = [...chats, userMessage];
    setChats(updatedChats);
    setMessage("");

    try {
      const messagesPayload = [
        ...updatedChats.slice(-5).map((chat) => ({
          role: chat.role === "user" ? "user" : "assistant",
          content: chat.message,
        })),
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesPayload,
          query: trimmed,
          collectionName: docname,
          graph,
          reasoning,
        }),
      });

      const data = await response.json();
      if (data.success && data.assistantMessage?.content) {
        setChats((prev) => [...prev, { role: "model", message: data.assistantMessage.content }]);
      } else {
        setChats((prev) => [
          ...prev,
          { role: "model", message: data.error || "Sorry, I couldn't get a response right now." },
        ]);
      }
    } catch (err) {
      console.error("Chat submission error", err);
      setChats((prev) => [
        ...prev,
        { role: "model", message: "Error: could not connect to chat API." },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveGeminiKey = async () => {
    if (!geminiKey.trim()) {
      setError("Enter a valid Gemini API key.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiKey: geminiKey.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHasKey(true);
        setError("");
      } else {
        const message = data?.error || "Could not save key.";
        const details = data?.details ? ` ${data.details}` : "";
        setError(`${message}${details}`);
      }
    } catch (err) {
      console.error(err);
      setError("Could not save Gemini API key. Please make sure you're signed in.");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateStageMessage = (index: number, newMessage: string) => {
    setChats((prev) => {
      const copy = [...prev];
      if (index >= 0 && index < copy.length) {
        copy[index] = { ...copy[index], message: newMessage };
      }
      return copy;
    });
  };

  const sendReasoningFlow = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Type a question to send.");
      return;
    }
    if (!hasKey) {
      setError("Please enter your Gemini API key in settings before asking.");
      return;
    }
    if (!docname) {
      setError("Upload a PDF first.");
      return;
    }
    if (reasoningInProgress) {
      setError("Reasoning flow already in progress.");
      return;
    }
    setError("");
    setReasoningInProgress(true);
    setReasoningStage(1);
    setIsProcessing(true);

    const userMsg: ChatMessage = { role: "user", message: trimmed };
    setChats((prev) => [
      ...prev,
      userMsg,
      { role: "model", message: "Reasoning stage 1/5 generating..." },
    ]);

    const stagePrompts = [
      "Stage 1/5: Determine the 5-step plan to answer the user query. Output clear numbered steps.",
      "Stage 2/5: Using the query and the document context, provide reasoning for step 1 in the plan.",
      "Stage 3/5: Using the query and the document context, provide reasoning for step 2.",
      "Stage 4/5: Using the query and the document context, provide reasoning for step 3 and step 4.",
      "Stage 5/5: Produce the final long answer (comprehensive, detailed, with references to the document context).",
    ];

    const stageHistory: ChatMessage[] = [userMsg];

    for (let stage = 1; stage <= 5; stage++) {
      setReasoningStage(stage);
      const stagePrompt = stagePrompts[stage - 1];
      const stageResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionName: docname,
          query: trimmed,
          graph,
          reasoning: true,
          reasoningStage: stage,
          stagePrompt,
          messages: [...chats.slice(-5), ...stageHistory],
        }),
      });

      const data = await stageResponse.json();
      const answer =
        data.success && data.assistantMessage?.content
          ? data.assistantMessage.content
          : data.error || "Could not generate reasoning stage output.";

      setChats((prev) => {
        const copy = [...prev];
        const modelIndex = copy.length - 1;
        if (modelIndex >= 0 && copy[modelIndex].role === "model") {
          copy[modelIndex] = { ...copy[modelIndex], message: `Stage ${stage}/5:\n${answer}` };
        }
        return copy;
      });

      if (!data.success) {
        setError(answer);
        break;
      }

      stageHistory.push({ role: "model", message: `Stage ${stage}/5: ${answer}` });
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    setReasoningStage(null);
    setReasoningInProgress(false);
    setIsProcessing(false);
  };
  const sendOverview = async () => {
    if (!docname) {
      setError("Upload a PDF first");
      return;
    }
    setChats((prev) => [...prev, { role: "user", message: "Please summarize this document." }]);
    setError("");
    setIsProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overview: true, collectionName: docname, query: "overview" }),
      });
      const data = await response.json();
      if (data.success && data.assistantMessage?.content) {
        setOverView(data.assistantMessage.content);
        setChats((prev) => [...prev, { role: "model", message: data.assistantMessage.content }]);
        await sendAnalyse();
      } else {
        const message = data.error || "Sorry, I couldn't get an overview right now.";
        setChats((prev) => [...prev, { role: "model", message }]);
        setError(message);
      }
    } catch (err) {
      console.error("Overview request error", err);
      setChats((prev) => [
        ...prev,
        { role: "model", message: "Error: could not connect to overview API." },
      ]);
      setError("Overview request failed");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleChange = async (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setIsUploading(true);
    setName("Processing File: " + selectedFile.name + "...");

    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setDocName(data.collectionName);
        setDocName(data.collectionName);
        setIsPDFUploaded(true);
        const next = [
          { id: data.uploadId, fileName: data.file, collectionName: data.collectionName, createdAt: new Date().toISOString() },
          ...recentDocs.filter((x) => x.collectionName !== data.collectionName),
        ];
        setRecentDocs(next);
        setName("Upload Complete");
      } else {
        setError(data.error || "Upload failed");
        setName("Upload failed");
      }
    } catch (err) {
      console.error("Error Occured", err);
      setError("Upload failed");
      setName("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isPDFUploaded) {
    return (
      <div className="mx-auto grid w-full max-w-5xl gap-6 rounded-[32px] border border-foreground/10 bg-white/80 p-5 sm:p-6 md:p-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Get started</div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Upload a PDF to build your workspace.</h2>
          <p className="text-sm text-muted-foreground">
            We will index your document, surface highlights, and keep context so you can ask follow-ups.
          </p>
          <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 text-sm text-muted-foreground">
            Drag a PDF into your workspace to create a knowledge base, then ask questions in natural language.
          </div>
          {recentDocs.length > 0 && (
            <div className="mt-2">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recent collections</div>
              <div className="mt-2 space-y-2">
                {recentDocs.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between gap-2 rounded-full border border-border bg-slate-50 px-3 py-1 text-xs">
                    <button
                      className={`flex-1 text-left ${docname === upload.collectionName ? "font-semibold" : "text-muted-foreground"}`}
                      onClick={() => {
                        setDocName(upload.collectionName);
                        setIsPDFUploaded(true);
                        setName(`Using collection: ${upload.fileName}`);
                      }}
                    >
                      {upload.fileName}
                    </button>
                    <button
                      className="rounded-full border border-red-200 px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-50"
                      onClick={async () => {
                        setIsProcessing(true);
                        const res = await fetch(`/api/upload?id=${upload.id}`, { method: "DELETE" });
                        const body = await res.json();
                          if (body.success) {
                            setRecentDocs((prev) => prev.filter((u) => u.id !== upload.id));
                            if (docname === upload.collectionName) {
                              setIsPDFUploaded(false);
                              setDocName("");
                            }
                          } else {
                          setError(body.error || "Could not delete upload");
                        }
                        setIsProcessing(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-foreground/15 bg-amber-50/40 p-5 sm:p-6 text-center">
          <div className="text-lg font-semibold">Upload a PDF</div>
          <div className="text-xs text-muted-foreground">Supported: reports, manuals, research papers.</div>          {!hasKey && (
            <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-50 p-3 text-left">
              <div className="text-xs font-semibold text-amber-800">Enter your Gemini API key first</div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  type="password"
                  placeholder="gemini key"
                  className="w-full rounded-md border border-foreground/20 px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={saveGeminiKey}
                  disabled={isProcessing}
                  className="w-full rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background disabled:opacity-40 sm:w-auto"
                >
                  Save
                </button>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Your key is stored securely in your user profile.</div>
            </div>
          )}          <label
            htmlFor="file"
            className="cursor-pointer rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-foreground/90"
          >
            {isUploading ? "Uploading..." : "Choose PDF"}
          </label>
          <input id="file" type="file" accept=".pdf" className="hidden" onChange={handleChange} disabled={isUploading} />
          {name && <div className="mt-2 text-sm text-muted-foreground">{name}</div>}
          {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex h-full w-full flex-col rounded-[32px] border border-foreground/10 bg-white/80 p-3 sm:p-4 md:min-h-[32rem]">
        {relationOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="relative h-full w-full border border-white/30 bg-white p-4 md:p-6">
              <Button
                className="absolute z-9999 right-4 top-4 rounded-full bg-foreground px-4 text-background hover:bg-foreground/90"
                onClick={() => setRelationOpen(false)}
              >
                Close
              </Button>
              <div className="absolute left-4 top-4 rounded-2xl border border-foreground/10 bg-white/90 px-3 py-2 text-xs text-muted-foreground">
                Drag to move | Scroll to zoom | Click nodes to focus
              </div>
              <div id="graph" className="h-full w-full" />
            </div>
          </div>
        )}
        <div className="mb-3 flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between sm:px-2">
          <div>
            <div className="text-base font-semibold sm:text-lg">Chat with your PDF</div>
            <p className="text-xs text-muted-foreground">Ask questions and get document-aware replies.</p>
            {docname && <p className="text-xs text-primary">Current collection: {docname}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <input
              ref={fileInputRef}
              id="file-new"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleChange}
              disabled={isUploading}
            />
            <Button
              variant="secondary"
              className="w-full rounded-full px-4 sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload new PDF"}
            </Button>
            <span className="w-full truncate sm:w-auto">{name || "Ready"}</span>
            {isProcessing && (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px]">Working...</span>
            )}
          </div>
        </div>
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-foreground/10 bg-white p-3 sm:p-4">
          <div className="space-y-3">
            {chats.map((e, i) => {
              const isUser = e.role === "user";
              const isLast = i === chats.length - 1;
              const content = !isUser && isLast ? streamedMessage : e.message;
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm sm:max-w-[80%] ${
                      isUser
                        ? "bg-foreground text-background"
                        : "bg-emerald-50 text-slate-900"
                    }`}
                  >
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex w-full gap-2 overflow-x-auto text-xs text-muted-foreground sm:flex-wrap">
            {[
              "Summarize key risks",
              "Extract timelines",
              "Draft an exec brief",
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => setMessage(chip)}
                className="whitespace-nowrap rounded-full border border-foreground/10 bg-white px-3 py-1 transition hover:bg-muted"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
        {!hasKey && (
          <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <div className="mb-2 font-semibold">Enter your Gemini API key to use this workspace:</div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                type="password"
                placeholder="Gemini API key"
                className="flex-1 rounded-xl border border-amber-300 px-3 py-2 text-sm outline-none"
              />
              <Button className="w-full sm:w-auto" onClick={saveGeminiKey} disabled={isProcessing}>Save key</Button>
            </div>
          </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap">
          <TextareaAutosize
            minRows={1}
            className="col-span-2 min-w-0 flex-1 resize-none rounded-2xl border border-foreground/10 bg-white px-4 py-2 text-sm outline-none focus:border-foreground sm:col-span-1 sm:min-w-[14rem]"
            placeholder="Type your question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            onClick={() => sendMessage(false)}
            className="h-full w-full rounded-full px-4 py-2 text-xs sm:w-auto sm:px-6 sm:text-sm"
            disabled={!message.trim() || isProcessing}
          >
            {isProcessing ? "Sending..." : "Send"}
          </Button>
          <Button
            variant="secondary"
            onClick={sendReasoningFlow}
            className="h-full w-full rounded-full px-4 py-2 text-xs sm:w-auto sm:px-6 sm:text-sm"
            disabled={!message.trim() || isProcessing || reasoningInProgress}
          >
            {reasoningInProgress ? `Reasoning ${reasoningStage ? `${reasoningStage}/5` : "..."}` : "Reasoning"}
          </Button>
          <Button
            variant="secondary"
            onClick={sendOverview}
            className="h-full w-full rounded-full px-4 py-2 text-xs sm:w-auto sm:text-sm"
            disabled={isProcessing || !docname}
          >
            {isProcessing ? "Working..." : "Overview"}
          </Button>
          <Button
            variant="secondary"
            onClick={fetchGraph}
            className="h-full w-full rounded-full px-4 py-2 text-xs sm:w-auto sm:text-sm"
            disabled={!overview.length || isProcessing}
          >
            {isProcessing ? "Loading..." : "Relationship"}
          </Button>
        </div>
      </div>
    </>
  );
}
