"use client"

import { Button } from "@/components/ui/button"
import { ChatType, SettingsForm, WeekDay } from "./ui/settings-form"
import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { getBot } from "./api/bot"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"

export default function Page() {
  const { data: session } = authClient.useSession()

  const { data, isLoading } = useQuery<{
    id: string
    userId: string
    settings: {
      isActive: boolean
      answerOnFirstMessage: boolean
      chatTypes: Array<ChatType>
      weekDayText: { days: WeekDay[]; text: string }[]
    }
  }>({
    queryKey: ["bot", session!.user.id],
    queryFn: () => getBot(session!.user.id),
  })
  console.log(data)
  return (
    <>
      {isLoading ? (
        <Spinner className="size-12" />
      ) : !data ? (
        <>
          <h1>К вашему аккаунту ещё не подключен бот</h1>
          <Button asChild>
            <Link
              href={`https://www.avito.ru/oauth?response_type=code&client_id=${process.env.NEXT_PUBLIC_AVITO_CLIENT_ID}&scope=user:read,messenger:read,messenger:write,items:info,stats:read`}
            >
              Подключить бота
            </Link>
          </Button>
        </>
      ) : (
        <SettingsForm {...data.settings} />
      )}
    </>
  )
}
