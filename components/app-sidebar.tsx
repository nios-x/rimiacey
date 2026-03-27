"use client"

import * as React from "react"

import { NavUser } from "@/components/nav-user"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { FileIcon, SparklesIcon, Share2Icon, BookOpenIcon, SettingsIcon, TerminalIcon } from "lucide-react"

const data = {
  user: {
    name: "Rimiacey",
    email: "hello@rimiacey.ai",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Uploads",
      url: "#",
      icon: <FileIcon />,
      isActive: true,
    },
    {
      title: "Chats",
      url: "#",
      icon: <SparklesIcon />,
      isActive: false,
    },
    {
      title: "Graphs",
      url: "#",
      icon: <Share2Icon />,
      isActive: false,
    },
    {
      title: "Library",
      url: "#",
      icon: <BookOpenIcon />,
      isActive: false,
    },
    {
      title: "Settings",
      url: "#",
      icon: <SettingsIcon />,
      isActive: false,
    },
  ],
}

type UploadItem = { id: string; fileName: string; collectionName: string; createdAt: string };

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  uploads?: UploadItem[];
  setUploads?: React.Dispatch<React.SetStateAction<UploadItem[]>>;
  selectedDoc?: string;
  onSelectDoc?: (collectionName: string, fileName: string) => void;
};

export function AppSidebar({
  uploads: uploadsProp,
  setUploads: setUploadsProp,
  selectedDoc,
  onSelectDoc,
  ...props
}: AppSidebarProps) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [uploadsInternal, setUploadsInternal] = React.useState<UploadItem[]>([])
  const uploads = uploadsProp ?? uploadsInternal
  const setUploads = setUploadsProp ?? setUploadsInternal
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (uploadsProp) return
    const load = async () => {
      try {
        const res = await fetch("/api/upload")
        const data = await res.json()
        if (data.uploads) setUploads(data.uploads)
      } catch (err) {
        console.error("Failed to load uploads", err)
      }
    }
    load()
  }, [uploadsProp, setUploads])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r border-foreground/10 bg-white/80 pt-4 dark:border-white/10 dark:bg-slate-900/80"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-teal-600 via-emerald-500 to-amber-400 text-white">
                    <TerminalIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Rimiacey</span>
                    <span className="truncate text-xs">Workspace</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => setActiveItem(item)}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      <Sidebar
        collapsible="none"
        className="hidden flex-1 border-r border-foreground/10 bg-white/70 pt-4 md:flex border-t-2 dark:border-white/10 dark:bg-slate-900/70"
      >
        <SidebarHeader className="gap-3.5 border-foreground/10 p-4 border-t dark:border-white/10">
          <div className="flex w-full items-center justify-between ">
            <div className="text-base font-medium text-foreground dark:text-slate-100">{activeItem?.title}</div>
            <Label className="flex items-center gap-2 text-sm dark:text-slate-200">
              <span>Auto-sync</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Search PDFs..." className="dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {uploads.length > 0 ? (
                uploads.map((upload) => {
                  const isSelected = selectedDoc === upload.collectionName
                  return (
                  <div
                    key={upload.id}
                    className={`flex flex-col gap-1 border-b border-foreground/10 p-3 text-sm leading-tight last:border-b-0 ${isSelected ? "bg-slate-100/70 dark:bg-white/5" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 text-xs text-muted-foreground dark:text-slate-300">
                      <button
                        className="text-left"
                        onClick={() => onSelectDoc?.(upload.collectionName, upload.fileName)}
                      >
                        <div className={`font-semibold text-[15px] ${isSelected ? "text-slate-900 dark:text-white" : "text-zinc-800 dark:text-slate-100"}`}>{upload.fileName}</div>
                        <div className="text-[11px] text-muted-foreground dark:text-slate-400">
                          Uploaded {new Date(upload.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        className="rounded-full border border-red-200 px-2 py-0.5 text-[11px] text-red-600 hover:bg-red-50 dark:border-red-400/40 dark:text-red-300 dark:hover:bg-red-500/10"
                        disabled={deletingId === upload.id}
                        onClick={async () => {
                          setDeletingId(upload.id)
                          try {
                            const res = await fetch(`/api/upload?id=${upload.id}`, { method: "DELETE" })
                            const body = await res.json()
                            if (body.success) {
                              setUploads((prev) => prev.filter((u) => u.id !== upload.id))
                              if (selectedDoc === upload.collectionName) {
                                const remaining = uploads.filter((u) => u.id !== upload.id)
                                if (remaining.length > 0) {
                                  onSelectDoc?.(remaining[0].collectionName, remaining[0].fileName)
                                } else {
                                  onSelectDoc?.("", "")
                                }
                              }
                            }
                          } catch (err) {
                            console.error("Failed to delete upload", err)
                          } finally {
                            setDeletingId(null)
                          }
                        }}
                      >
                        {deletingId === upload.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )})
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground dark:border-white/10 dark:text-slate-300">
                  No PDFs uploaded yet. Upload one from the chat page.
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
