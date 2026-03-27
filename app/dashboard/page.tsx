"use client"
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Chats from "@/components/Chats";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const quickStats = [
  { label: "Active collections", value: "12" },
  { label: "Questions answered", value: "1,482" },
  { label: "Graphs generated", value: "86" },
];

export default function Page() {
  type UploadItem = { id: string; fileName: string; collectionName: string; createdAt: string };
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState("");

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const res = await fetch("/api/upload");
        const data = await res.json();
        if (data.uploads) {
          setUploads(data.uploads);
          if (!selectedDoc && data.uploads.length > 0) {
            setSelectedDoc(data.uploads[0].collectionName);
          }
        }
      } catch (err) {
        console.error("Failed to load uploads", err);
      }
    };
    loadUploads();
  }, []);

  const handleSelectDoc = (collectionName: string) => {
    setSelectedDoc(collectionName);
  };

  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" } as CSSProperties}>
      <AppSidebar
        uploads={uploads}
        setUploads={setUploads}
        selectedDoc={selectedDoc}
        onSelectDoc={(collectionName) => handleSelectDoc(collectionName)}
      />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex shrink-0 flex-col gap-3 border-b bg-white/80 px-3 py-3 backdrop-blur sm:px-4 sm:py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Upload a PDF</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Chats</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
            <span className="rounded-full border border-foreground/10 bg-white px-3 py-1">Workspace: Atlas</span>
            <span className="rounded-full border border-foreground/10 bg-white px-3 py-1">Last sync: 2 min ago</span>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6">
          <div className="hidden gap-3 sm:grid sm:gap-4 md:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-foreground/10 bg-white/80 p-3 sm:p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
                <div className="mt-3 text-2xl font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
          <Chats
            uploads={uploads}
            setUploads={setUploads}
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
