import { LinkBotButton } from "@/features/bot/link-bot-button"
import { SettingsForm } from "@/features/bot/settings-form"
import { authClient } from "@/shared/api/auth-client"
import {
  useBotControllerDeleteBot,
  useBotControllerGetBot,
} from "@/shared/api/endpoints/bot/bot"
import { Spinner } from "@/shared/ui/spinner"
import { toast } from "sonner"

export function BotSettings({ botId }: { botId: string }) {
  const { data: session } = authClient.useSession()

  const {
    data: bot,
    isLoading: isLoadingBot,
    refetch: refetchBot,
  } = useBotControllerGetBot(session!.user.id, botId)

  const deleteBot = useBotControllerDeleteBot()

  const onDeleteBotHandler = async () => {
    await deleteBot.mutateAsync({ userId: session!.user.id, botId })

    await refetchBot()

    toast.success("Бот удален")
  }

  return (
    <>
      {isLoadingBot ? (
        <Spinner className="size-12" />
      ) : !bot ? (
        <div className="flex flex-col items-center gap-2">
          <h1>К вашему аккаунту ещё не подключен бот</h1>
          <LinkBotButton />
        </div>
      ) : (
        <SettingsForm
          botId={botId}
          deletingBot={deleteBot.isPending}
          onDeleteBot={onDeleteBotHandler}
        />
      )}
    </>
  )
}
