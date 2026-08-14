"use client"

import { SettingsForm } from "@/features/bot/settings-form"
import { authClient } from "@/shared/api/auth-client"
import {
  useBotControllerDeleteBot,
  useBotControllerGetBot,
} from "@/shared/api/endpoints/bot/bot"
import { Spinner } from "@/shared/ui/spinner"
import { toast } from "sonner"
import { BotUnlinked } from "./bot-unlinked"
import { ScheduleForm } from "@/features/bot/sсhedule-form"

export function BotSettings({ botId }: { botId: string }) {
  const { data: session } = authClient.useSession()
  const user = session!.user

  const {
    data: bot,
    isLoading: isLoadingBot,
    refetch: refetchBot,
  } = useBotControllerGetBot(user.id, botId)

  const deleteBot = useBotControllerDeleteBot()

  const handleDeleteBotHandler = async () => {
    await deleteBot.mutateAsync({ userId: session!.user.id, botId })

    await refetchBot()

    toast.success("Бот удален")
  }

  if (isLoadingBot) return <Spinner className="size-12" />

  if (!bot) return <BotUnlinked />

  return (
    <>
      <SettingsForm
        botId={botId}
        deletingBot={deleteBot.isPending}
        onDeleteBot={handleDeleteBotHandler}
      />
      <ScheduleForm botId={botId} userId={user.id} />
    </>
  )
}
