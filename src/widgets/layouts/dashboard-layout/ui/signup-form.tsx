"use client"

import { Button } from "@shared/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/ui/field"
import { Input } from "@shared/ui/input"
import { authClient } from "@shared/api/auth-client"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import z from "zod"
import { Spinner } from "./ui/spinner"

const formSchema = z
  .object({
    name: z.string().min(6, "Минимум 6 символов"),
    email: z.email(),
    password: z.string().min(8, "Минимум 8 символов"),
    confirmPassword: z.string().min(8, "Минимум 8 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const signUpMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      authClient.signUp.email(data),
  })

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await signUpMutation.mutateAsync({
        email: value.email,
        name: value.name,
        password: value.password,
      })

      if (!error) redirect(process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL || "/")
    },
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>
          Введите информацию ниже, чтобы создать ваш аккаунт
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="name">Имя</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder="Полное имя"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="name">Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="email"
                      placeholder="mail@example.com"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="name">Пароль</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      placeholder="Должен содержать минимум 8 символов"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="name">Подтверждение пароля</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      placeholder="Пожалуйста, подтвердите ваш пароль"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <FieldGroup>
              <Field>
                <Button type="submit">
                  {signUpMutation.isPending && (
                    <Spinner data-icon="inline-start" />
                  )}
                  Создать аккаунт
                </Button>
                <FieldDescription className="px-6 text-center">
                  Уже есть аккаунт? <a href="login">Войти</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
