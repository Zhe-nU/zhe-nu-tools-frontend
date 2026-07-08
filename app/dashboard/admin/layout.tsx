import { RoleGuard } from "@/shared/ui/role-guard"

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RoleGuard roles={["admin"]}>{children}</RoleGuard>
}
