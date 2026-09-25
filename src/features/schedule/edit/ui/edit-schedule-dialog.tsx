import { authClient } from "@/shared/api/auth-client"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog"
import React from "react"
import { useScheduleControllerGetSchedule } from "@/entities/schedule/api/schedule.api"
import { EditScheduleForm } from "./edit-schedule-form"
import { ScheduleWithItemsDto } from "@/shared/api/zod/models/scheduleWithItemsDto.zod"
import { Button } from "@/shared/ui/button"

type Props = {
  scheduleId: string
  onUpdateSchedule?: (id: string, newSchedule: ScheduleWithItemsDto) => void
}

export function EditScheduleDialog({
  scheduleId,
  onUpdateSchedule,
  ...props
}: Props & React.ComponentProps<typeof Dialog>) {
  const { data: session } = authClient.useSession()
  const user = session!.user

  const { data: schedule } = useScheduleControllerGetSchedule(
    user.id,
    scheduleId
  )
  if (!schedule) return

  const handleUpdateSchedule = (
    id: string,
    newSchedule: ScheduleWithItemsDto
  ) => {
    onUpdateSchedule?.(id, newSchedule)
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Настроить расписание &quot;{schedule?.name}&quot;
          </DialogTitle>
          <DialogDescription>
            Ниже вы можете настроить расписание
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[70vh] overflow-y-auto px-4">
          <EditScheduleForm
            schedule={schedule}
            userId={user.id}
            onUpdateSchedule={handleUpdateSchedule}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
