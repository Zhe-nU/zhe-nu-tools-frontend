"use client"

import { usePathname } from "next/navigation"
import { SearchForm } from "@shared/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@shared/ui/breadcrumb"
import { Button } from "@shared/ui/button"
import { Separator } from "@shared/ui/separator"
import { useSidebar } from "@shared/ui/sidebar"
import { PanelLeftIcon } from "lucide-react"

const pageTitles: Record<string, string> = {
  "/dashboard": "Панель управления",
  "/dashboard/bots": "Управление ботом",
  "/dashboard/schedules": "Расписания",
  "/dashboard/admin": "Администрирование",
  "/dashboard/profile": "Профиль",
}

function getPageTitle(pathname: string): string {
  const exact = pageTitles[pathname]
  if (exact) return exact

  if (pathname.startsWith("/dashboard/bots/")) return "Бот"
  return "Панель управления"
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname || '')

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Панель управления</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
      </div>
    </header>
  )
}
