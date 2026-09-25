import z from "zod"

export const editScheduleFormSchema = z.object({
  name: z.string().min(1),
})

export type EditScheduleFormValues = z.input<typeof editScheduleFormSchema>
