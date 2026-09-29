"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/shared/ui/item"
import { UpdatePasswordDialog } from "./update-password-dialog"
import { useState } from "react"

export function SecurityForm() {
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Пароль и безопасность</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item size="xs">
              <ItemContent>
                <ItemTitle>Пароль</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="outline"
                  onClick={() => setIsUpdatePasswordDialogOpen(true)}
                >
                  Изменить
                </Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      <UpdatePasswordDialog
        open={isUpdatePasswordDialogOpen}
        onOpenChange={setIsUpdatePasswordDialogOpen}
      />
    </>
  )
}
