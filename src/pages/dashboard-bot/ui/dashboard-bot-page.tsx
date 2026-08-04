import { BotSettings } from "@/widgets/bot-settings"

export function DashboardBotPage({ params }: { params: { botId: string } }) {
  return <BotSettings botId={params.botId} />
}
