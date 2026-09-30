import { BotSettings } from "@/widgets/bot-settings"

export async function DashboardBotPage({
  params,
}: {
  params: { botId: string }
}) {
  const { botId } = await params
  return <BotSettings botId={botId} />
}
