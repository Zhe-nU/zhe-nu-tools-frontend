import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"
import { SidebarInset, SidebarProvider } from "@shared/ui/sidebar"
import { AuthGuard } from "@/features/auth/guards"

export function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AuthGuard>
  )
}
