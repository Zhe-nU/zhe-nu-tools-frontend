import z from "zod"

export const editScheduleFormSchema = z.object({
  name: z.string().min(1),
  description: z.string()
})

export type EditScheduleFormValues = z.input<typeof editScheduleFormSchema>
