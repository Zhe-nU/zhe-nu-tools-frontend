"use client"

import { Button } from "@/components/ui/button"
import { ChatType, SettingsForm, WeekDay } from "./ui/settings-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { deleteBot, getBot } from "./api/bot"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
  useBotControllerGetBot,
  useBotControllerGetBotSettings,
} from "@/app/client/endpoints/bot/bot"

export default function Page() {
  const { data: session } = authClient.useSession()

  // const { data, isLoading, refetch } = useQuery<{
  //   id: string
  //   userId: string
  //   settings: {
  //     isActive: boolean
  //     answerOnFirstMessage: boolean
  //     chatTypes: Array<ChatType>
  //     weekDayText: { days: WeekDay[]; text: string }[]
  //   }
  // }>({
  //   queryKey: ["bot", session!.user.id],
  //   queryFn: () => getBot(session!.user.id),
  // })

  const {
    data: bot,
    isLoading: isLoadingBot,
    refetch: refetchBot,
  } = useBotControllerGetBot(session!.user.id)

  const deleteBotMutation = useMutation({
    mutationFn: () => deleteBot(session!.user.id),
  })

  const onDeleteBotHandler = async () => {
    await deleteBotMutation.mutateAsync()

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
          <Button asChild>
            <Link
              href={`https://www.avito.ru/oauth?response_type=code&client_id=${process.env.NEXT_PUBLIC_AVITO_CLIENT_ID}&scope=user:read,messenger:read,messenger:write,items:info,stats:read`}
              target="_blank"
            >
              Подключить бота
            </Link>
          </Button>
        </div>
      ) : (
        <SettingsForm
          botId={bot.id}
          deletingBot={deleteBotMutation.isPending}
          onDeleteBot={onDeleteBotHandler}
        />
      )}
    </>
  )
}
