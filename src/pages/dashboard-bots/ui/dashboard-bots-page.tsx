"use client"

import { authClient } from "@/shared/api/auth-client"
import { useBotControllerGetUserBots } from "@/shared/api/endpoints/bot/bot"
import { BotUnlinked } from "@/widgets/bot-settings/ui/bot-unlinked"
import { redirect } from "next/navigation"

export function DashboardBotsPage() {
  const { data: session } = authClient.useSession()

  const { data: bots } = useBotControllerGetUserBots(session!.user.id)
  if (bots?.length) redirect(`bots/${bots[0].id}`)

  return <BotUnlinked />
}
