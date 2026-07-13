import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { toast } from "sonner"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  plugins: [adminClient()],
  fetchOptions: {
    onError(context) {
      toast.error(`Ошибка ${context.error.code}: ${context.error.message}`)
      throw context.error
    },
  },
})
