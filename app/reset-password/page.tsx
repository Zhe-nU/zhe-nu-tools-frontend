"use client"

import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "./ui/reset-password-form"

export default function Page() {
  const params = useSearchParams()
  const token = params.get("token")

  if (!token) {
    return <div>Token is missing</div>
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
