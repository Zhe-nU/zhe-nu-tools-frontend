import { Button } from "@/shared/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { Item, ItemActions, ItemContent } from "@/shared/ui/item"
import { Textarea } from "@/shared/ui/textarea"
import { CopyIcon, Trash2 } from "lucide-react"
import dayjs from "dayjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { WeekDays } from "@/shared/lib/constants/weekDays"
import { ScheduleItemsFormApi } from "../model/use-schedule-items-form"

const WEEK_DAYS: Record<WeekDays, string> = {
  mon: "Понедельник",
  tue: "Вторник",
  wed: "Среда",
  thu: "Четверг",
  fri: "Пятница",
  sat: "Суббота",
  sun: "Воскресенье",
}

type Time = { hours: number; minutes: number }

type Props = {
  form: ScheduleItemsFormApi
  index: number
  weekDay: WeekDays
  onCopy: (weekDay: WeekDays, itemIdx: number) => void
  onDelete: () => void
}

export function SchedulePartItem({
  form,
  index,
  weekDay,
  onCopy,
  onDelete,
}: Props) {
  const renderTimeField = (
    fieldName: "startTime" | "endTime",
    label: string
  ) => {
    return (
      <form.Field name={`items[${index}].time.${fieldName}`}>
        {(timeField) => {
          const isInvalid =
            timeField.state.meta.isTouched && !timeField.state.meta.isValid
          const value = timeField.state.value as Time

          const handleTimeChange = (time: string) =>
            (
              timeField.handleChange as (time: {
                hours: number
                minutes: number
              }) => void
            )({
              hours: Number(time.split(":")[0]),
              minutes: Number(time.split(":")[1]),
            })

          return (
            <Field className="w-35">
              <FieldLabel htmlFor={timeField.name}>{label}</FieldLabel>
              <Input
                id={timeField.name}
                name={timeField.name}
                type="time"
                value={dayjs()
                  .hour(value.hours)
                  .minute(value.minutes)
                  .format("HH:mm")}
                onBlur={timeField.handleBlur}
                onChange={(e) => handleTimeChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={timeField.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>
    )
  }

  return (
    <Item variant="outline">
      <ItemContent>
        <FieldGroup>
          <form.Field name={`items[${index}].time`}>
            {(timeField) => {
              const isInvalid =
                timeField.state.meta.isTouched && !timeField.state.meta.isValid

              return (
                <Field orientation="horizontal">
                  {renderTimeField("startTime", "Время начала")}
                  {renderTimeField("endTime", "Время окончания")}

                  {isInvalid && (
                    <FieldError errors={timeField.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name={`items[${index}].text`}>
            {(textField) => {
              const isInvalid =
                textField.state.meta.isTouched && !textField.state.meta.isValid

              return (
                <Field>
                  <FieldLabel htmlFor={textField.name}>Сообщение</FieldLabel>
                  <Textarea
                    id={textField.name}
                    name={textField.name}
                    value={(textField.state.value ?? "") as string}
                    onBlur={textField.handleBlur}
                    onChange={(e) =>
                      (textField.handleChange as (value: string) => void)(
                        e.target.value
                      )
                    }
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && (
                    <FieldError errors={textField.state.meta.errors} />
                  )}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
      </ItemContent>
      <ItemActions className="flex-col">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Удалить часть"
          onClick={onDelete}
        >
          <Trash2 />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Копировать часть расписания"
            >
              <CopyIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {(Object.keys(WEEK_DAYS) as WeekDays[]).map((wD) => (
                <DropdownMenuItem
                  key={wD}
                  disabled={wD === weekDay}
                  aria-label="Удалить часть"
                  onClick={() => onCopy(wD, index)}
                >
                  {WEEK_DAYS[wD]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Будние дни</DropdownMenuItem>
              <DropdownMenuItem>Выходные дни</DropdownMenuItem>
              <DropdownMenuItem>Все дни</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  )
}
