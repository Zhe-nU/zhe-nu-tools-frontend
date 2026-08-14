import { authClient } from "@/shared/api/auth-client"
import {
  useBotControllerGetBotSchedules,
  useBotControllerGetBotSettings,
  useBotControllerUpdateBotSettings,
} from "@/shared/api/endpoints/bot/bot"
import { useScheduleControllerUpdateSchedule } from "@/shared/api/endpoints/schedule/schedule"
import { BotControllerUpdateBotSettingsBody } from "@/shared/api/zod/endpoints/zheNUToolsAPI.zod"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import { Checkbox } from "@/shared/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/ui/field"
import { Spinner } from "@/shared/ui/spinner"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

type Props = {
  botId: string
  deletingBot?: boolean
  onDeleteBot?: () => void
}

const formSchema = BotControllerUpdateBotSettingsBody.required()

export function SettingsForm({ botId, deletingBot, onDeleteBot }: Props) {
  const { data: session } = authClient.useSession()
  const userId = session!.user.id

  const { data: botSettings, isLoading: isLoadingBotSettings } =
    useBotControllerGetBotSettings(userId, botId)

  const updateBotSettings = useBotControllerUpdateBotSettings()

  const form = useForm({
    defaultValues: {
      answerOnFirstMessage: botSettings?.answerOnFirstMessage ?? true,
      isActive: botSettings?.isActive ?? false,
      chatTypes: botSettings?.chatTypes ?? [],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await updateBotSettings.mutateAsync({
        userId,
        botId,
        data: {
          ...value,
        },
      })

      toast.success("Настройки сохранены")
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
                const chatTypesSet = new Set(field.state.value)

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
                            checked={chatTypesSet.has("u2u")}
                            onBlur={field.handleBlur}
                            onCheckedChange={(checked) =>
                              field.handleChange(
                                checked === true
                                  ? Array.from(chatTypesSet.add("u2u"))
                                  : () => {
                                      chatTypesSet.delete("u2u")
                                      return Array.from(chatTypesSet)
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
                            checked={chatTypesSet.has("u2i")}
                            onBlur={field.handleBlur}
                            onCheckedChange={(checked) =>
                              field.handleChange(
                                checked === true
                                  ? () => Array.from(chatTypesSet.add("u2i"))
                                  : () => {
                                      chatTypesSet.delete("u2i")
                                      return Array.from(chatTypesSet)
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
