import { useScheduleItemControllerCreateScheduleItem } from "@/shared/api/endpoints/schedule-item/schedule-item"
import { ScheduleItemControllerCreateScheduleItemBody } from "@/shared/api/zod/endpoints/zheNUToolsAPI.zod"
import { WeekDays } from "@/shared/lib/constants/weekDays"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { useForm } from "@tanstack/react-form"
import React from "react"
import z from "zod"

type Props = {
  userId: string
  scheduleId: string
  weekDay?: WeekDays
}

const formSchema = ScheduleItemControllerCreateScheduleItemBody

export function AddScheduleItemDialog({
  userId,
  scheduleId,
  weekDay,
  ...props
}: Props & React.ComponentProps<typeof Dialog>) {
  const createScheduleItem = useScheduleItemControllerCreateScheduleItem()

  const defaultValues: z.input<typeof formSchema> = {
    weekDay: weekDay ?? "mon",
    time: {
      startTime: [0, 0],
      endTime: [0, 0],
    },
    text: "",
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    async onSubmit({ value }) {
      await createScheduleItem.mutateAsync({
        userId,
        scheduleId,
        data: { ...value },
      })
    },
  })

  return (
    <Dialog {...props}>
      <form id="add-schedule-item-form">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить ответ</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <form
            id="add-schedule-item-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          ></form>

          <DialogFooter>
            <DialogClose asChild>
              <Button>Отмена</Button>
            </DialogClose>
            <Button type="submit">Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
