import { BulkUpdateScheduleItemsDtoItemsItem } from "@/shared/api/models"
import { useForm } from "@tanstack/react-form"
import {
  scheduleItemsSchema,
  ScheduleItemsValues,
} from "./schedule-items.schema"
import { useScheduleItemControllerDeleteScheduleItem } from "@/entities/schedule-item/api/schedule-item"
import { WeekDays } from "@/shared/lib/constants/weekDays"
import {
  useScheduleItemControllerBulkCreateScheduleItems,
  useScheduleItemControllerBulkUpdateScheduleItems,
  useScheduleItemControllerGetScheduleItems,
  useSetScheduleItemControllerGetScheduleItemsQueryData,
} from "@/shared/api/endpoints/schedule-item/schedule-item"
import { ScheduleItem } from "./types"

type Props = {
  userId: string
  scheduleId: string
}

export function useScheduleItemsForm({ userId, scheduleId }: Props) {
  const { data: items = [] } = useScheduleItemControllerGetScheduleItems(
    userId,
    scheduleId
  )

  const bulkCreateScheduleItems =
    useScheduleItemControllerBulkCreateScheduleItems()

  const bulkUpdateScheduleItems =
    useScheduleItemControllerBulkUpdateScheduleItems()

  const removeScheduleItem = useScheduleItemControllerDeleteScheduleItem()

  const updateScheduleItemList =
    useSetScheduleItemControllerGetScheduleItemsQueryData()

  const form = useForm({
    defaultValues: {
      items: items,
    } satisfies ScheduleItemsValues as ScheduleItemsValues,
    validators: {
      onChange: scheduleItemsSchema,
      onSubmit: scheduleItemsSchema,
    },
    onSubmit: async ({ value }) => {
      const newItems = await bulkCreateScheduleItems.mutateAsync({
        userId,
        scheduleId: scheduleId,
        data: { items: value.items.filter((item) => !item.id) },
      })

      const items: BulkUpdateScheduleItemsDtoItemsItem[] = value.items.filter(
        (item): item is ScheduleItem & { id: string } => item.id !== undefined
      )

      const updatedItems = await bulkUpdateScheduleItems.mutateAsync({
        userId,
        scheduleId: scheduleId,
        data: { items },
      })

      updateScheduleItemList(userId, scheduleId, () =>
        [...newItems, ...updatedItems].sort(
          (a, b) => a.time.startTime.hours - b.time.startTime.hours
        )
      )
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
        scheduleId: scheduleId,
        itemId: item.id,
      })

    form.removeFieldValue("items", idx)
    form.validateField("items", "submit")
  }

  return { form, items, addItem, copyItem, deleteItem }
}

export type ScheduleItemsFormApi = ReturnType<
  typeof useScheduleItemsForm
>["form"]
