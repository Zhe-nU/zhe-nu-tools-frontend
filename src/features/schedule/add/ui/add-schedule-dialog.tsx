import { authClient } from "@/shared/api/auth-client"
import { useScheduleControllerCreateSchedule } from "@/shared/api/endpoints/schedule/schedule"
import { ScheduleControllerCreateScheduleBody } from "@/shared/api/zod/endpoints/zheNUToolsAPI.zod"
import { Button } from "@/shared/ui/button"
import { Field, FieldGroup } from "@/shared/ui/field"
import { TextField } from "@/shared/ui/form/text-field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog"
import { useForm } from "@tanstack/react-form"
import React from "react"
import z from "zod"
import { ScheduleWithItemsDto } from "@/entities/schedule"

const formSchema = ScheduleControllerCreateScheduleBody

type Props = {
  onAddSchedule?: (schedule: ScheduleWithItemsDto) => void
}

export function AddScheduleDialog({
  onAddSchedule,
  onOpenChange,
  ...props
}: Props & React.ComponentProps<typeof Dialog>) {
  const { data: session } = authClient.useSession()
  const user = session!.user

  const addSchedule = useScheduleControllerCreateSchedule()

  const defaultValues: z.input<typeof formSchema> = {
    name: "",
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const schedule = await addSchedule.mutateAsync({
        userId: user.id,
        data: value,
      })

      onAddSchedule?.(schedule)
      onOpenChange?.(false)
    },
  })

  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <form
        id="add-schedule-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать расписание;</DialogTitle>
            <DialogDescription>
              Ниже вы можете настроить расписание
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <TextField
              form={form}
              name="name"
              label="Название расписания"
              placeholder="Название"
            />

            <TextField
              form={form}
              name="name"
              label="Описание"
              placeholder="Описание"
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Закрыть</Button>
            </DialogClose>
            <Button type="submit" form="add-schedule-form">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
