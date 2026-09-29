"use client"

import { authClient } from "@shared/api/auth-client"
import { Spinner } from "@shared/ui/spinner"
import { redirect } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <Spinner />

  if (!session) redirect("/login")

  return children
}
