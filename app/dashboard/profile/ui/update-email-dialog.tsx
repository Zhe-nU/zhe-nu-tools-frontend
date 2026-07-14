import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import z from "zod"

const schema = z.object({
  email: z.email("Введите корректный адрес электронной почты"),
})

export function UpdateEmailDialog({
  ...props
}: React.ComponentProps<typeof Dialog>) {
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await authClient.changeEmail({
        newEmail: value.email,
      })

      props.onOpenChange?.(false)

      toast.success("Адрес электронной почты успешно изменен!")
    },
  })

  return (
    <Dialog {...props}>
      <form
        id="update-email-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить адрес электронной почты</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button type="submit" form="update-email-form">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
