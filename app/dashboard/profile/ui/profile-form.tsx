import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import z from "zod"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Укажите текущий пароль"),
    newPassword: z.string().min(8, "Минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export function ProfileForm() {
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      })

      toast.success("Пароль изменен")
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление профилем</CardTitle>
        <CardDescription>
          Ниже вы можете управлять своим профилем
        </CardDescription>
      </CardHeader>
      <CardTitle>
        <form id="profile-form">
          <form id="password-form"></form>
        </form>
      </CardTitle>
    </Card>
  )
}
