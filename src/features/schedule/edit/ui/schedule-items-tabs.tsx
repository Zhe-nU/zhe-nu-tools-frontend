import { weekDays, WeekDays } from "@/shared/lib/constants/weekDays"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Field, FieldGroup } from "@/shared/ui/field"
import { SchedulePartItem } from "./schedule-part-item"
import { Button } from "@/shared/ui/button"
import { PlusIcon } from "lucide-react"
import { useScheduleItemsForm } from "../model/use-schedule-items-form"
import { ScheduleWithItemsDto } from "@/entities/schedule"

type Props = {
  userId: string
  schedule: ScheduleWithItemsDto
  items: ScheduleWithItemsDto["items"]
}

export function ScheduleItemsTabs({ userId, schedule, items }: Props) {
  const {
    form: scheduleItemsForm,
    addItem,
    copyItem,
    deleteItem,
  } = useScheduleItemsForm({
    userId,
    schedule,
    items,
  })

  return (
    <form
      id="schedule-items-form"
      onSubmit={(e) => {
        e.preventDefault()
        scheduleItemsForm.handleSubmit()
      }}
    >
      <scheduleItemsForm.Field name="items" mode="array">
        {(field) => {
          const items = field.state.value ?? []
          return (
            <Tabs defaultValue="mon">
              <TabsList>
                {Object.entries(weekDays).map(([k, v]) => (
                  <TabsTrigger key={k} value={k}>
                    {v}
                  </TabsTrigger>
                ))}
              </TabsList>

              {(Object.keys(weekDays) as WeekDays[]).map((weekDay) => {
                const dayItems = items
                  .map((item, index) => ({ item, index }))
                  .filter(({ item }) => item.weekDay === weekDay)

                return (
                  <TabsContent key={weekDay} value={weekDay}>
                    <FieldGroup>
                      {dayItems.map(({ index }) => (
                        <SchedulePartItem
                          key={index}
                          form={scheduleItemsForm}
                          index={index}
                          weekDay={weekDay}
                          onCopy={copyItem}
                          onDelete={() => deleteItem(index)}
                        />
                      ))}

                      {dayItems.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Нет частей расписания для этого дня
                        </p>
                      )}

                      <Field orientation="horizontal">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addItem(weekDay)}
                        >
                          <PlusIcon />
                          Добавить часть
                        </Button>
                      </Field>
                    </FieldGroup>
                  </TabsContent>
                )
              })}
            </Tabs>
          )
        }}
      </scheduleItemsForm.Field>
    </form>
  )
}
