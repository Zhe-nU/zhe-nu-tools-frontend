import { RoleGuard } from "@features/auth/guards"

export function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RoleGuard roles={["admin"]}>{children}</RoleGuard>
}
