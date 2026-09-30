"use client"

import { authClient } from "@shared/api/auth-client"
import { Spinner } from "@shared/ui/spinner"
import { redirect } from "next/navigation"

export function RoleGuard({
  children,
  roles,
}: {
  children: React.ReactNode
  roles: string[]
}) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <Spinner />

  if (!roles.includes(session!.user.role || ""))
    redirect("/dashboard/manage-bot")

  return children
}
