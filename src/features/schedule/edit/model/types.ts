import { ScheduleItemDto } from "@/shared/api/models"

export interface ScheduleItem extends Omit<ScheduleItemDto, "id"> {
  id?: string
}
