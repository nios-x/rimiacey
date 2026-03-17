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

const quickStats = [
  { label: "Active collections", value: "12" },
  { label: "Questions answered", value: "1,482" },
  { label: "Graphs generated", value: "86" },
];

export default function Page() {
  return (
    <SidebarProvider style={{ "--sidebar-width": "350px" } as CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-16 z-30 flex shrink-0 flex-col gap-3 border-b bg-white/80 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-6">
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
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-foreground/10 bg-white px-3 py-1">Workspace: Atlas</span>
            <span className="rounded-full border border-foreground/10 bg-white px-3 py-1">Last sync: 2 min ago</span>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-foreground/10 bg-white/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
                <div className="mt-3 text-2xl font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
          <Chats />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
