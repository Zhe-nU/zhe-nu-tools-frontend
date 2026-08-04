"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import z from "zod"
import { useForm } from "@tanstack/react-form"
import { authClient } from "@/lib/auth-client"
import { useMutation } from "@tanstack/react-query"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Минимум 8 символов"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const signInMutation = useMutation({
    mutationFn: (data: {
      email: string
      password: string
      rememberMe?: boolean | undefined
      callbackURL?: string | undefined
    }) => authClient.signIn.email(data),
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync({
        email: value.email,
        password: value.password,
        rememberMe: true,
        callbackURL: process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL,
      })
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Войти в ваш аккаунт</CardTitle>
          <CardDescription>
            Введите данные ниже, чтобы войти в ваш аккаунт
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
                    <Field>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Пароль</FieldLabel>
                        {/* <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Забыли пароль?
                        </a> */}
                      </div>
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
              <Field>
                <Button type="submit">Войти</Button>
                <FieldDescription className="text-center">
                  У вас ещё нет аккаунта? <a href="signup">Регистрация</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
