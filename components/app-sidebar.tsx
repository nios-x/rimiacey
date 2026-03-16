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

// This is sample data
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
      icon: (
        <FileIcon />
      ),
      isActive: true,
    },
    {
      title: "Chats",
      url: "#",
      icon: (
        <SparklesIcon />
      ),
      isActive: false,
    },
    {
      title: "Graphs",
      url: "#",
      icon: (
        <Share2Icon />
      ),
      isActive: false,
    },
    {
      title: "Library",
      url: "#",
      icon: (
        <BookOpenIcon />
      ),
      isActive: false,
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <SettingsIcon />
      ),
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [pdfs, setPdfs] = React.useState<string[]>([])
  const [pdfsLinks, setPdfsLinks] = React.useState<string[]>([])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem('pdfs')
      if (!raw) return
      const arr = JSON.parse(raw)
      if (!Array.isArray(arr)) return
      let arrt:any= []
      const parsed = arr
        .filter((it) => typeof it === 'string')
        .map((key) => {
          const match = key.match(/^pdf_chunks-[^-]+-(.+)$/)
          arrt.push(key)
          return match ? match[1] : key
        })
      setPdfsLinks(arrt)
      setPdfs(parsed)
    } catch (err) {
      console.error('Failed to read local pdfs', err)
    }
  }, [])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Auto-sync</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Search PDFs..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {pdfs.length > 0 ? (
                pdfs.map((pdf, idx) => (
                  <div
                    key={`${pdf}-${idx}`}
                    className="flex flex-col gap-1 border-b p-3 text-sm leading-tight last:border-b-0"
                  >
                    <div className="items-center gap-2 text-xs text-muted-foreground">
                      <div className="font-semibold text-zinc-800 text-[15px]">{pdfsLinks[idx] || pdf}</div>
                      <div className="text-[11px] text-muted-foreground">Stored as {pdf}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
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
