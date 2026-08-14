import { authClient } from "@/shared/api/auth-client"
import {
  useScheduleControllerGetSchedule,
  useScheduleControllerUpdateSchedule,
} from "@/shared/api/endpoints/schedule/schedule"
import { ScheduleControllerUpdateScheduleBody } from "@/shared/api/zod/endpoints/zheNUToolsAPI.zod"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/shared/ui/field"
import { TextField } from "@/shared/ui/form/text-field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemGroup,
  ItemTitle,
} from "@/shared/ui/item"
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
import React, { useState } from "react"
import { AddScheduleItemDialog } from "./add-schedule-item-dialog"
import { WeekDays } from "@/shared/lib/constants/weekDays"
import z from "zod"
import { Textarea } from "@/shared/ui/textarea"
import { EditIcon, PlusIcon, SaveIcon } from "lucide-react"
import { Input } from "@/shared/ui/input"
import dayjs from "dayjs"

const WEEK_DAYS: Record<WeekDays, string> = {
  mon: "Понедельник",
  tue: "Вторник",
  wed: "Среда",
  thu: "Четверг",
  fri: "Пятница",
  sat: "Суббота",
  sun: "Воскресенье",
}

type Props = { scheduleId: string }

const formSchema = ScheduleControllerUpdateScheduleBody

export function EditScheduleDialog({
  scheduleId,
  ...props
}: Props & React.ComponentProps<typeof Dialog>) {
  const [isAddScheduleItemDialogOpen, setIsAddScheduleItemDialogOpen] =
    useState(false)
  const [addScheduleItemWeekDay, setAddScheduleItemWeekDay] =
    useState<WeekDays>()

  const { data: session } = authClient.useSession()
  const user = session!.user

  const { data: schedule, isLoading: isLoadingSchedule } =
    useScheduleControllerGetSchedule(user.id, scheduleId)

  const updateSchedule = useScheduleControllerUpdateSchedule()

  const defaultValues: z.input<typeof formSchema> = {
    name: schedule?.name ?? "",
    items: schedule?.items ?? [],
  }

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await updateSchedule.mutateAsync({
        userId: user.id,
        scheduleId,
        data: value,
      })
    },
  })

  const handleAddScheduleItem = (weekDay: WeekDays) => {
    setAddScheduleItemWeekDay(weekDay)
    setIsAddScheduleItemDialogOpen(true)
  }

  return (
    <Dialog {...props}>
      <form
        id="update-schedule-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Настроить расписание &quot;{schedule?.name}&quot;
            </DialogTitle>
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

            <form.Field name="items" mode="array">
              {(field) => {
                return (
                  <Tabs defaultValue="mon">
                    <TabsList>
                      {Object.entries(WEEK_DAYS).map(([k, v]) => (
                        <TabsTrigger key={k} value={k}>
                          {v}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(WEEK_DAYS).map(([k, v]) => (
                      <TabsContent key={k} value={k}>
                        <FieldSet>
                          {schedule?.items
                            .filter((item) => item.weekDay === k)
                            .map((item) => (
                              <FieldGroup key={item.id}>
                                <div className="flex flex-row gap-4">
                                  <Field className="w-fit">
                                    <FieldLabel>Начало</FieldLabel>
                                    <Input
                                      type="time"
                                      defaultValue={dayjs()
                                        .hour(item.time.startTime.hours)
                                        .minute(item.time.startTime.minutes)
                                        .format("HH:mm")}
                                      min="00:00"
                                      max="23:59"
                                    />
                                  </Field>
                                  <Field className="w-fit">
                                    <FieldLabel>Конец</FieldLabel>
                                    <Input
                                      type="time"
                                      defaultValue={dayjs()
                                        .hour(item.time.endTime.hours)
                                        .minute(item.time.endTime.minutes)
                                        .format("HH:mm")}
                                      min="00:00"
                                      max="23:59"
                                    />
                                  </Field>
                                </div>
                                <Field>
                                  <FieldLabel>Текст автоответа</FieldLabel>
                                  <Textarea
                                    id={field.name}
                                    name={field.name}
                                    type={type}
                                    placeholder={placeholder}
                                    value={field.state.value as string}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      (
                                        field.handleChange as (
                                          value: string
                                        ) => void
                                      )(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    autoComplete="off"
                                  />
                                </Field>
                                {isInvalid && (
                                  <FieldError
                                    errors={field.state.meta.errors}
                                  />
                                )}
                              </FieldGroup>
                            ))}

                          <Field orientation="horizontal">
                            <Button
                              type="button"
                              onClick={() =>
                                handleAddScheduleItem(k as WeekDays)
                              }
                            >
                              <PlusIcon />
                            </Button>
                          </Field>
                        </FieldSet>
                      </TabsContent>
                    ))}
                  </Tabs>
                )
              }}
            </form.Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Закрыть</Button>
            </DialogClose>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </form>

      <AddScheduleItemDialog
        userId=""
        scheduleId=""
        weekDay={addScheduleItemWeekDay}
        open={isAddScheduleItemDialogOpen}
        onOpenChange={setIsAddScheduleItemDialogOpen}
      />
    </Dialog>
  )
}
