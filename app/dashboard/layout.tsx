import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import QueryProviders from "@/providers/query-provider"
import { queryClient } from "@/shared/api/query-client"
import { AuthGuard } from "@/shared/ui/auth-guard"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log(queryClient)
  return (
    <AuthGuard>
      <div className="[--header-height:calc(--spacing(14))]">
        <Toaster />
        <QueryProviders>
          <SidebarProvider className="flex flex-col">
            <SiteHeader />
            <div className="flex flex-1">
              <AppSidebar />
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </QueryProviders>
      </div>
    </AuthGuard>
  )
}
