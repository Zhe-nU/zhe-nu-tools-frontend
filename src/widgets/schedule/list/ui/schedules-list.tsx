"use client"

import { AddScheduleDialog } from "@/features/schedule/add"
import { EditScheduleDialog } from "@/features/schedule/edit"
import { useScheduleList } from "@/features/schedule/list/model/use-schedule-list"
import { authClient } from "@/shared/api/auth-client"
import {
  SchedulesWithItemsDtoItem,
} from "@/shared/api/models"
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
import { Edit, PlusIcon, Trash } from "lucide-react"
import { useState } from "react"

export function SchedulesList() {
  const [isOpenAddScheduleDialog, setIsOpenAddScheduleDailog] = useState(false)

  const [isOpenEditScheduleDialog, setIsOpenEditScheduleDailog] =
    useState(false)

  const { data: session } = authClient.useSession()
  const user = session!.user

  const {
    schedules,
    editingScheduleId,
    setEditingScheduleId,
    handleAddSchedule,
    handleUpdateSchedule,
    handleRemoveSchedule,
  } = useScheduleList({ userId: user.id })

  const handleOpenEditScheduleDialog = (
    schedule: SchedulesWithItemsDtoItem
  ) => {
    setEditingScheduleId(schedule.id)
    setIsOpenEditScheduleDailog(true)
  }

  // if (isLoadingSchedules) return <Spinner className="size-12" />

  if (!schedules?.length) return "Не найдено расписаний"

  return (
    <>
      <div>
        <Button onClick={() => setIsOpenAddScheduleDailog(true)}>
          <PlusIcon />
        </Button>
      </div>
      <ItemGroup className="gap-4">
        {schedules.map((s) => (
          <Item key={s.id}>
            <ItemContent>
              <ItemTitle>{s.name}</ItemTitle>
              <ItemDescription>{"Описание"}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                onClick={() => handleOpenEditScheduleDialog(s)}
              >
                <Edit />
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRemoveSchedule(s.id)}
              >
                <Trash />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      <AddScheduleDialog
        open={isOpenAddScheduleDialog}
        onOpenChange={setIsOpenAddScheduleDailog}
        onAddSchedule={handleAddSchedule}
      />

      {editingScheduleId && (
        <EditScheduleDialog
          open={isOpenEditScheduleDialog}
          onOpenChange={setIsOpenEditScheduleDailog}
          scheduleId={editingScheduleId}
          onUpdateSchedule={handleUpdateSchedule}
        />
      )}
    </>
  )
}
