import { use } from "react"
import { ResetPasswordForm } from "./ui/reset-password-form"

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = use(searchParams)

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
