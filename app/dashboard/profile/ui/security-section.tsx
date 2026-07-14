"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { useState } from "react"
import { UpdatePasswordDialog } from "./update-password-dialog"

export function SecuritySection() {
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] =
    useState(false)

  return (
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
              <UpdatePasswordDialog
                open={isUpdatePasswordDialogOpen}
                onOpenChange={setIsUpdatePasswordDialogOpen}
              />
            </ItemActions>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
