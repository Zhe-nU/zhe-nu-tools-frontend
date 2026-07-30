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
import { ChevronsUpDownIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react"
import { toast } from "sonner"
import z from "zod"
import { updateBotSettings } from "../api/bot"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/spinner"
import {
  useBotControllerGetBotSettings,
  useBotControllerUpdateBotSettings,
} from "@/app/client/endpoints/bot/bot"
import { BotControllerUpdateBotSettingsBody } from "@/app/client/zod/endpoints/zheNUToolsAPI.zod"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

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

const formSchema = BotControllerUpdateBotSettingsBody.extend({
  chatTypes: z.set(z.enum(CHAT_TYPES)).transform((c) => Array.from(c)),
})

export function SettingsForm({
  botId,
  deletingBot,
  onDeleteBot,
  ...props
}: {
  botId: string
  deletingBot?: boolean
  onDeleteBot?: () => void
} & React.ComponentProps<typeof Card>) {
  const { data: session } = authClient.useSession()

  const {
    data: botSettings,
    isLoading: isLoadingBotSettings,
    refetch: refetchBotSettings,
  } = useBotControllerGetBotSettings(session!.user.id, botId)

  const updateBotSettings = useBotControllerUpdateBotSettings()

  const form = useForm({
    defaultValues: {
      isActive: botSettings?.isActive,
      chatTypes: new Set(botSettings?.chatTypes),
    } as z.input<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await updateBotSettings.mutateAsync({
        userId: session!.user.id,
        botId,
        data: value,
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
      <CardContent className="space-y-4">
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
            {/* <form.Field
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
            /> */}
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
          </FieldGroup>
        </form>

        <Separator />

        <FieldSet>
          <FieldLegend>Условия</FieldLegend>
          <FieldDescription>
            Ниже вы можете настроить условия для срабатывания автоответа
          </FieldDescription>
          <FieldGroup>
            <FieldLabel>Расписание</FieldLabel>
            <FieldDescription>
              Выберите расписания для автоответа
            </FieldDescription>
            <Field>
              <div className="flex gap-2">
                <div className="inline-flex w-fit items-center rounded-full border border-transparent bg-primary px-1 py-0.5 text-xs font-medium text-primary-foreground select-none">
                  <Button variant="ghost" size="xs" className="rounded-full">
                    ПН-ПТ 9:00-18:00
                  </Button>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    className="rounded-full"
                  >
                    <XIcon />
                  </Button>
                </div>

                <Dialog>
                  <DialogTrigger>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                    >
                      <PlusIcon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Добавить расписание</DialogTitle>
                      <DialogDescription>
                        Выберите расписание из вашего списка
                      </DialogDescription>
                    </DialogHeader>

                    <Item>
                      <ItemContent>
                        <ItemTitle>Основное расписание</ItemTitle>
                        <ItemDescription>
                          Расписание для будних дней
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button variant="outline">Добавить</Button>
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="outline">Редактировать</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Редактировать расписание
                              </DialogTitle>
                              <DialogDescription>
                                Основное расписание
                              </DialogDescription>
                            </DialogHeader>

                            <Collapsible>
                              <div className="flex items-center justify-between gap-4">
                                <h4 className="text-sm font-semibold">
                                  Понедельник
                                </h4>
                                <CollapsibleTrigger>
                                  <Button variant="ghost" size="icon">
                                    <ChevronsUpDownIcon />
                                    <span className="sr-only">
                                      Toggle details
                                    </span>
                                  </Button>
                                </CollapsibleTrigger>
                              </div>

                              <CollapsibleContent className="flex flex-col gap-2 px-4">
                                <div className="flex flex-col gap-2 py-2 text-sm">
                                  <p className="font-medium">00:00 - 23:59</p>
                                  <Textarea />
                                </div>

                                <Separator />

                                <div className="flex flex-col gap-2 py-2 text-sm">
                                  <p className="font-medium">00:00 - 23:59</p>
                                  <Textarea />
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                            <Collapsible>
                              <div className="flex items-center justify-between gap-4">
                                <h4 className="text-sm font-semibold">
                                  Вторник
                                </h4>
                                <CollapsibleTrigger>
                                  <Button variant="ghost" size="icon">
                                    <ChevronsUpDownIcon />
                                    <span className="sr-only">
                                      Toggle details
                                    </span>
                                  </Button>
                                </CollapsibleTrigger>
                              </div>

                              <CollapsibleContent className="flex flex-col gap-2 px-4">
                                <div className="flex flex-col gap-2 py-2 text-sm">
                                  <p className="font-medium">00:00 - 23:59</p>
                                  <Textarea />
                                </div>

                                <Separator />

                                <div className="flex flex-col gap-2 py-2 text-sm">
                                  <p className="font-medium">00:00 - 23:59</p>
                                  <Textarea />
                                </div>
                              </CollapsibleContent>
                            </Collapsible>

                            <DialogFooter>
                              <DialogClose asChild><Button>Закрыть</Button></DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </ItemActions>
                    </Item>
                  </DialogContent>
                </Dialog>
              </div>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Объявления</FieldLabel>
            <Field></Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit" form="bot-settings-form">
          Сохранить
        </Button>

        <Button variant="destructive" onClick={() => onDeleteBot?.()}>
          {deletingBot && <Spinner data-icon="inline-start" />}
          Отвязать бота
        </Button>
      </CardFooter>
    </Card>
  )
}
