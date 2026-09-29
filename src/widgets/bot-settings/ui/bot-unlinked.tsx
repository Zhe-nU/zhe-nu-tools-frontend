import { LinkBotButton } from "@/features/bot/link-bot-button"

export function BotUnlinked() {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1>К вашему аккаунту ещё не подключен бот</h1>
      <LinkBotButton />
    </div>
  )
}
