"use client"

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import z from "zod"
import { UpdatePasswordDialog } from "./update-password-dialog"
import { useState } from "react"

export function ProfileForm() {
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Пароль и безопасность</CardTitle>
      </CardHeader>
      <CardContent>
        <Field orientation="horizontal">
          <FieldLabel>Пароль</FieldLabel>

          <Button onClick={() => setIsUpdatePasswordDialogOpen(true)}>
            Изменить пароль
          </Button>

          <UpdatePasswordDialog
            open={isUpdatePasswordDialogOpen}
            onOpenChange={setIsUpdatePasswordDialogOpen}
          />
        </Field>
      </CardContent>
    </Card>
  )
}
