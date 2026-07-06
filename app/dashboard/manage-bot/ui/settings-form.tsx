"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import z from "zod"
import { getBotSettings, updateBotSettings } from "../api/bot"
import { authClient } from "@/lib/auth-client"

const CHAT_TYPES = ["u2u", "u2i"] as const
const WEEK_DAYS = [
  { value: "mon", label: "Пн" },
  { value: "tue", label: "Вт" },
  { value: "wed", label: "Ср" },
  { value: "thu", label: "Чт" },
  { value: "fri", label: "Пт" },
  { value: "sat", label: "Сб" },
  { value: "sun", label: "Вс" },
] as const

export type ChatType = (typeof CHAT_TYPES)[number]
export type WeekDay = (typeof WEEK_DAYS)[number]["value"]

const formSchema = z.object({
  answerOnFirstMessage: z.boolean(),
  chatTypes: z.set(z.enum(CHAT_TYPES)),
  isActive: z.boolean(),
  weekDayText: z.array(
    z.object({
      days: z
        .array(z.enum(WEEK_DAYS.map((d) => d.value)))
        .min(1, "Выберите хотя бы 1 день недели"),
      text: z.string().min(1, "Текст сообщения не может быть пустым"),
    })
  ),
})

export function SettingsForm({
  answerOnFirstMessage,
  chatTypes,
  isActive,
  weekDayText,
  ...props
}: {
  answerOnFirstMessage: boolean
  chatTypes: Array<ChatType>
  isActive: boolean
  weekDayText: { days: WeekDay[]; text: string }[]
} & React.ComponentProps<typeof Card>) {
  const { data: session } = authClient.useSession()
  const updateBotSettingsMuitation = useMutation({
    mutationFn: (data: { isActive: boolean; chatTypes: Array<ChatType> }) =>
      updateBotSettings(session!.user.id, data),
  })

  const form = useForm({
    defaultValues: {
      answerOnFirstMessage,
      isActive,
      chatTypes: new Set(chatTypes),
      weekDayText: weekDayText.length
        ? weekDayText
        : ([
            {
              days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
              text: "",
            },
          ] as {
            days: WeekDay[]
            text: string
          }[]),
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await updateBotSettingsMuitation.mutateAsync({
        ...value,
        chatTypes: Array.from(value.chatTypes),
      })

      toast.success("Настройки сохранены")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки Avito бота</CardTitle>
        <CardDescription>
          Ниже вы можете управлять поведением Avito бота
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="bot-settings-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="isActive"
              children={(field) => {
                return (
                  <Field orientation="horizontal">
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Включить бота
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                )
              }}
            />
            <form.Field
              name="answerOnFirstMessage"
              children={(field) => {
                return (
                  <Field orientation="horizontal">
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      disabled
                      onBlur={field.handleBlur}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Отвечать только на первое сообщение в чате
                      </FieldLabel>
                    </FieldContent>
                  </Field>
                )
              }}
            />
            <form.Field
              name="chatTypes"
              children={(field) => {
                return (
                  <Field>
                    <FieldSet>
                      <FieldLegend variant="label">
                        Чаты для автоответа:
                      </FieldLegend>
                      <FieldDescription>
                        Выберите чаты для которых необходимо включить функцию
                        автоответа
                      </FieldDescription>
                      <FieldGroup className="gap-3">
                        <Field orientation="horizontal">
                          <Checkbox
                            id={field.name}
                            name={field.name}
                            checked={field.state.value.has("u2u")}
                            onBlur={field.handleBlur}
                            onCheckedChange={(checked) =>
                              field.handleChange(
                                checked === true
                                  ? field.state.value.add("u2u")
                                  : () => {
                                      field.state.value.delete("u2u")
                                      return field.state.value
                                    }
                              )
                            }
                          />
                          <FieldLabel
                            htmlFor={field.name}
                            className="font-normal"
                          >
                            Чаты с пользователями
                          </FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="u2i"
                            name="u2i"
                            checked={field.state.value.has("u2i")}
                            onBlur={field.handleBlur}
                            onCheckedChange={(checked) =>
                              field.handleChange(
                                checked === true
                                  ? field.state.value.add("u2i")
                                  : () => {
                                      field.state.value.delete("u2i")
                                      return field.state.value
                                    }
                              )
                            }
                          />
                          <FieldLabel htmlFor="u2i" className="font-normal">
                            Чаты по объявлениям
                          </FieldLabel>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </Field>
                )
              }}
            />
            <FieldSeparator />
            <form.Field name="weekDayText" mode="array">
              {(field) => {
                return (
                  <Field>
                    <FieldLabel>Текст автоответа:</FieldLabel>
                    <FieldDescription>
                      Введите текст сообщения для автоответа ниже (при
                      необходимости выберите дни для ответа)
                    </FieldDescription>
                    <div className="space-y-4">
                      {field.state.value.map((_, i) => (
                        <div className="space-y-2" key={i}>
                          <div className="flex justify-between">
                            <form.Field name={`weekDayText[${i}].days`}>
                              {(subField) => {
                                const isInvalid =
                                  subField.state.meta.isTouched &&
                                  !subField.state.meta.isValid
                                return (
                                  <Field data-invalid={isInvalid}>
                                    <ToggleGroup
                                      onValueChange={(value: WeekDay[]) => {
                                        field.handleChange(
                                          field.state.value.map((i) => ({
                                            days: i.days.filter(
                                              (day) => !value.includes(day)
                                            ),
                                            text: i.text,
                                          }))
                                        )
                                        subField.handleChange(value)
                                      }}
                                      value={subField.state.value}
                                      variant="outline"
                                      type="multiple"
                                    >
                                      {WEEK_DAYS.map((day, i) => (
                                        <ToggleGroupItem
                                          key={i}
                                          value={day.value}
                                        >
                                          {day.label}
                                        </ToggleGroupItem>
                                      ))}
                                    </ToggleGroup>
                                    {isInvalid && (
                                      <FieldError
                                        errors={subField.state.meta.errors}
                                      />
                                    )}
                                  </Field>
                                )
                              }}
                            </form.Field>
                            {i > 0 && (
                              <Button
                                onClick={() => field.removeValue(i)}
                                type="button"
                                variant="destructive"
                              >
                                <TrashIcon />
                              </Button>
                            )}
                          </div>
                          <form.Field name={`weekDayText[${i}].text`}>
                            {(subField) => {
                              const isInvalid =
                                subField.state.meta.isTouched &&
                                !subField.state.meta.isValid
                              return (
                                <Field data-invalid={isInvalid}>
                                  <Textarea
                                    id={field.name}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="Текст сообщения"
                                    value={subField.state.value}
                                  />
                                  {isInvalid && (
                                    <FieldError
                                      errors={subField.state.meta.errors}
                                    />
                                  )}
                                </Field>
                              )
                            }}
                          </form.Field>
                        </div>
                      ))}

                      <Button
                        onClick={() => field.pushValue({ days: [], text: "" })}
                        type="button"
                      >
                        <PlusIcon />
                      </Button>
                    </div>{" "}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="bot-settings-form">
            Сохранить
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
