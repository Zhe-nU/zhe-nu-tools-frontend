import {
  useBotControllerBindSchedule,
  useBotControllerGetBotSchedules,
  useBotControllerUnbindSchedule,
} from "@/shared/api/endpoints/bot/bot"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/shared/ui/item"
import { Spinner } from "@/shared/ui/spinner"
import { CalendarClock, Edit, Plus, Unlink } from "lucide-react"
import { BindScheduleModal } from "./bind-schedule-dialog"
import { useState } from "react"

type Props = { userId: string; botId: string }

export function ScheduleForm({ userId, botId }: Props) {
  const [openBindSchedule, setOpenBindSchedule] = useState(false)

  const {
    data: botSchedules,
    isLoading: isLoadingBotSchedules,
    refetch: refetchBotSchedules,
  } = useBotControllerGetBotSchedules(userId, botId)

  const bindSchedule = useBotControllerBindSchedule()
  const unbindSchedule = useBotControllerUnbindSchedule()

  const handleBindSchedule = async (scheduleId: string) => {
    await bindSchedule.mutateAsync({ userId, botId, data: { scheduleId } })
    await refetchBotSchedules()
  }

  const handleUnbindSchedule = async (scheduleId: string) => {
    await unbindSchedule.mutateAsync({ userId, botId, data: { scheduleId } })
    await refetchBotSchedules()
  }

  if (isLoadingBotSchedules)
    return (
      <Card>
        <CardContent>
          <Spinner className="size-12" />
        </CardContent>
      </Card>
    )

  if (!botSchedules) return

  return (
    <Card>
      <CardHeader>
        <CardTitle>Расписания</CardTitle>
        <CardDescription>
          Ниже вы можете выбрать расписания, по которым будет отвечать бот
        </CardDescription>
        <CardAction>
          <Button onClick={() => setOpenBindSchedule(true)}>
            <Plus />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-4">
          {botSchedules.map((schedule) => (
            <Item key={schedule.id} variant="outline">
              <ItemMedia variant="image">
                <div className="flex h-full w-full items-center justify-center rounded-sm bg-primary p-1">
                  <CalendarClock size={20} />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{schedule.name}</ItemTitle>
                <ItemDescription>Описание</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  onClick={() => handleUnbindSchedule(schedule.id)}
                  variant="destructive"
                >
                  <Unlink />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
      <BindScheduleModal
        open={openBindSchedule}
        onOpenChange={setOpenBindSchedule}
        onBindSchedule={handleBindSchedule}
      />
    </Card>
  )
}
