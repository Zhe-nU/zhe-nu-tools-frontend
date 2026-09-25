import { WeekDays } from "@/shared/lib/constants/weekDays"
import { findOverlappingWeekDayTimeIndices } from "@/shared/utils/time/overlapping"
import z from "zod"

const timeSchema = z.object({
  hours: z.number().int().min(0).max(23),
  minutes: z.number().int().min(0).max(59),
})

export const scheduleItemsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.uuid().optional(),
        weekDay: z.enum(WeekDays),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        time: z.object({
          startTime: timeSchema,
          endTime: timeSchema,
        }),
        text: z.string().min(1),
      })
    )
    .superRefine((items, ctx) => {
      const overlaps = findOverlappingWeekDayTimeIndices(items)

      for (const i of overlaps)
        ctx.addIssue({
          code: "custom",
          message: "Временные промежутки не должны пересекаться",
          path: [i, "time"],
        })
    }),
})

export type ScheduleItemsValues = z.input<typeof scheduleItemsSchema>
