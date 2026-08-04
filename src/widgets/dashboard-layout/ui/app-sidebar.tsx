"use client"

import * as React from "react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  TerminalSquareIcon,
  BotIcon,
  LifeBuoyIcon,
  SendIcon,
  UserKeyIcon,
} from "lucide-react"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession()

  const data = {
    user: {
      name: session!.user.name,
      email: session!.user.email,
      avatar: session!.user.image || "",
    },
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: <TerminalSquareIcon />,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: <LifeBuoyIcon />,
      },
      {
        title: "Feedback",
        url: "#",
        icon: <SendIcon />,
      },
    ],
    projects: [
      {
        name: "Управление ботом",
        url: "/dashboard/manage-bot",
        icon: <BotIcon />,
      },
      {
        name: "Администрирование",
        url: "/dashboard/admin/users",
        icon: <UserKeyIcon />,
        roles: ["admin"],
      },
    ],
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src='/img/logo.png' alt="Logo" width={40} height={40} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Zhe_nU</span>
                  <span className="truncate text-xs">Tools</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
