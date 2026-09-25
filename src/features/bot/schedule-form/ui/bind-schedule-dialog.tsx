import { authClient } from "@/shared/api/auth-client"
import { useScheduleControllerUserScheduleList } from "@/shared/api/endpoints/schedule/schedule"
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/shared/ui/item"
import { Link } from "lucide-react"
import React from "react"

type Props = { onBindSchedule?: (scheduleId: string) => void }

export function BindScheduleModal({
  onBindSchedule,
  ...props
}: Props & React.ComponentProps<typeof Dialog>) {
  const { data: session } = authClient.useSession()
  const user = session!.user

  const { data: schedules } = useScheduleControllerUserScheduleList(user.id)

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Привязать расписание к боту</DialogTitle>
          <DialogDescription>
            Ниже вы можете выбрать расписания для привязки к боту
          </DialogDescription>
        </DialogHeader>

        {schedules?.length ? (
          <ItemGroup className="gap-4">
            {schedules.map((s) => (
              <Item key={s.id} variant="outline">
                <ItemContent>
                  <ItemTitle>{s.name}</ItemTitle>
                  <ItemDescription>{}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    onClick={() => onBindSchedule?.(s.id)}
                    variant="outline"
                  >
                    <Link />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          "Не найдено расписаний"
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
