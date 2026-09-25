import { WeekDays } from "@/shared/lib/constants/weekDays"

export interface Time {
  hours: number
  minutes: number
}

export interface TimeInterval {
  startTime: Time
  endTime: Time
}

export interface WeekDayTimeInterval {
  weekDay: WeekDays
  time: TimeInterval
}
