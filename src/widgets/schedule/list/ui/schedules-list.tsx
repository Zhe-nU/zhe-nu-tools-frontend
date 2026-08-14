"use client"

import { EditScheduleDialog } from "@/features/schedule/edit"
import { authClient } from "@/shared/api/auth-client"
import { useScheduleControllerUserScheduleList } from "@/shared/api/endpoints/schedule/schedule"
import { SchedulesWithItemsDtoOutputItem } from "@/shared/api/models"
import { Button } from "@/shared/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/shared/ui/item"
import { Spinner } from "@/shared/ui/spinner"
import { Edit, Trash } from "lucide-react"
import { useState } from "react"

export function SchedulesList() {
  const [editingSchedule, setEditingSchedule] =
    useState<SchedulesWithItemsDtoOutputItem>()
  const [isOpenEditScheduleDialog, setIsOpenScheduleDailog] = useState(false)

  const { data: session } = authClient.useSession()
  const user = session!.user

  const { data: schedules, isLoading: isLoadingSchedules } =
    useScheduleControllerUserScheduleList(user.id)

  const handleOpenEditScheduleDialog = (
    schedule: SchedulesWithItemsDtoOutputItem
  ) => {
    setEditingSchedule(schedule)
    setIsOpenScheduleDailog(true)
  }

  if (isLoadingSchedules) return <Spinner className="size-12" />

  if (!schedules?.length) return "Не найдено расписаний"

  return (
    <>
      <ItemGroup className="gap-4">
        {schedules.map((s) => (
          <Item key={s.id}>
            <ItemContent>
              <ItemTitle>{s.name}</ItemTitle>
              <ItemDescription>{}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                onClick={() => handleOpenEditScheduleDialog(s)}
              >
                <Edit />
              </Button>
              <Button variant="destructive">
                <Trash />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      {editingSchedule && (
        <EditScheduleDialog
          open={isOpenEditScheduleDialog}
          onOpenChange={setIsOpenScheduleDailog}
          scheduleId={editingSchedule.id}
        />
      )}
    </>
  )
}
