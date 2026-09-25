import { ScheduleWithItemsDto } from "@/shared/api/models"
import { useForm } from "@tanstack/react-form"
import { scheduleItemsSchema } from "./schedule-items.schema"
import { useScheduleItemControllerDeleteScheduleItem } from "@/entities/schedule-item/api/schedule-item"
import { WeekDays } from "@/shared/lib/constants/weekDays"
import {
  useScheduleItemControllerBulkCreateScheduleItems,
  useScheduleItemControllerBulkUpdateScheduleItems,
} from "@/shared/api/endpoints/schedule-item/schedule-item"
import { ScheduleItem } from "./types"

type Props = {
  userId: string
  schedule: ScheduleWithItemsDto
  items: ScheduleItem[]
}

export function useScheduleItemsForm({ userId, schedule, items }: Props) {
  const bulkCreateScheduleItems =
    useScheduleItemControllerBulkCreateScheduleItems()

  const bulkUpdateScheduleItems =
    useScheduleItemControllerBulkUpdateScheduleItems()

  const removeScheduleItem = useScheduleItemControllerDeleteScheduleItem()

  const form = useForm({
    defaultValues: {
      items,
    },
    validators: {
      onChange: scheduleItemsSchema,
      onSubmit: scheduleItemsSchema,
    },
    onSubmit: async ({ value }) => {
      await bulkCreateScheduleItems.mutateAsync({
        userId,
        scheduleId: schedule.id,
        data: { items: value.items.filter((item) => !item.id) },
      })

      await bulkUpdateScheduleItems.mutateAsync({
        userId,
        scheduleId: schedule.id,
        data: { items: value.items.filter((item) => item.id !== undefined) },
      })
    },
  })

  const addItem = (weekDay: WeekDays) => {
    form.pushFieldValue("items", {
      weekDay,
      time: {
        startTime: { hours: 0, minutes: 0 },
        endTime: { hours: 23, minutes: 59 },
      },
      text: "",
    })
  }

  const copyItem = (weekDay: WeekDays, itemIdx: number) => {
    form.pushFieldValue("items", {
      ...form.getFieldValue(`items[${itemIdx}]`),
      weekDay,
    })
  }

  const deleteItem = async (idx: number) => {
    const item = form.getFieldValue(`items[${idx}]`)
    if (!item) return

    if (item.id)
      await removeScheduleItem.mutateAsync({
        userId,
        scheduleId: schedule.id,
        itemId: item.id,
      })

    form.removeFieldValue("items", idx)
    form.validateField("items", "submit")
  }

  return { form, addItem, copyItem, deleteItem }
}

export type ScheduleItemsFormApi = ReturnType<
  typeof useScheduleItemsForm
>["form"]
