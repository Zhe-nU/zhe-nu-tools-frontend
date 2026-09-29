import { Field, FieldGroup, FieldSeparator, FieldSet } from "@/shared/ui/field"
import { TextField } from "@/shared/ui/form/text-field"
import { useEditScheduleForm } from "../model/use-edit-schedule-form"
import { ScheduleWithItemsDto } from "@/entities/schedule"
import { ScheduleItemsTabs } from "./schedule-items-tabs"
import { Button } from "@/shared/ui/button"

type Props = {
  userId: string
  schedule: ScheduleWithItemsDto
  onUpdateSchedule?: (id: string, newSchedule: ScheduleWithItemsDto) => void
}

export function EditScheduleForm({
  schedule,
  userId,
  onUpdateSchedule,
}: Props) {
  const { form: editScheduleForm } = useEditScheduleForm({
    schedule,
    userId,
    onUpdateSchedule,
  })

  return (
    <FieldGroup>
      <form
        id="update-schedule-form"
        onSubmit={(e) => {
          e.preventDefault()
          editScheduleForm.handleSubmit()
        }}
      >
        <FieldSet>
          <TextField
            form={editScheduleForm}
            name="name"
            label="Название расписания"
            placeholder="Название"
          />

          <TextField
            form={editScheduleForm}
            name="description"
            label="Описание"
            placeholder="Описание"
          />

          <Field orientation="horizontal">
            <Button type="submit" form="update-schedule-form">
              Сохранить
            </Button>
          </Field>
        </FieldSet>
      </form>

      <FieldSeparator />

      <FieldSet>
        <ScheduleItemsTabs
          userId={userId}
          schedule={schedule}
          items={schedule.items}
        />

        <Field orientation="horizontal">
          <Button type="submit" form="schedule-items-form">
            Сохранить
          </Button>
        </Field>
      </FieldSet>
    </FieldGroup>
  )
}
