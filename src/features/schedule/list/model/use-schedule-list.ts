import {
  useScheduleControllerDeleteSchedule,
  useScheduleControllerUserScheduleList,
  useSetScheduleControllerGetScheduleQueryData,
  useSetScheduleControllerUserScheduleListQueryData,
} from "@/shared/api/endpoints/schedule/schedule"
import {
  SchedulesWithItemsDtoItem,
  ScheduleWithItemsDto,
} from "@/shared/api/models"
import { useState } from "react"

type Params = {
  userId: string
}

export function useScheduleList({ userId }: Params) {
  const [editingScheduleId, setEditingScheduleId] =
    useState<SchedulesWithItemsDtoItem["id"]>()

  const { data: schedules, isLoading: isLoadingSchedules } =
    useScheduleControllerUserScheduleList(userId)

  const updateSchedule = useSetScheduleControllerGetScheduleQueryData()
  const updateScheduleList = useSetScheduleControllerUserScheduleListQueryData()

  const removeSchedule = useScheduleControllerDeleteSchedule()

  const handleAddSchedule = (schedule: ScheduleWithItemsDto) => {
    updateScheduleList(userId, (old) => [...(old || []), schedule])
  }

  const handleUpdateSchedule = (
    id: string,
    newSchedule: ScheduleWithItemsDto
  ) => {
    updateSchedule(userId, id, newSchedule)
    updateScheduleList(userId, (old) =>
      old?.map((s) => (s.id === id ? newSchedule : s))
    )
  }

  const handleRemoveSchedule = async (id: string) => {
    await removeSchedule.mutateAsync({ userId, scheduleId: id })
    updateScheduleList(userId, (old) => old?.filter((s) => s.id !== id))
  }

  return {
    isLoadingSchedules,
    editingScheduleId,
    setEditingScheduleId,
    handleAddSchedule,
    handleUpdateSchedule,
    handleRemoveSchedule,
    schedules,
  }
}
