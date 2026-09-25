import { useForm } from "@tanstack/react-form"
import { editScheduleFormSchema } from "./edit-schedule.schema"
import {
  ScheduleWithItemsDto,
  useScheduleControllerUpdateSchedule,
} from "@/entities/schedule"

type Params = {
  userId: string
  schedule: ScheduleWithItemsDto
  onUpdateSchedule?: (id: string, newSchedule: ScheduleWithItemsDto) => void
}

export function useEditScheduleForm({
  userId,
  schedule,
  onUpdateSchedule,
}: Params) {
  const updateSchedule = useScheduleControllerUpdateSchedule()

  const form = useForm({
    defaultValues: {
      name: schedule.name,
    },
    validators: {
      onSubmit: editScheduleFormSchema,
    },
    onSubmit: async ({ value }) => {
      const newSchedule = await updateSchedule.mutateAsync({
        userId,
        scheduleId: schedule.id,
        data: value,
      })

      onUpdateSchedule?.(schedule.id, newSchedule)
    },
  })

  return { form }
}

export type EditScheduleFormApi = ReturnType<typeof useEditScheduleForm>["form"]
