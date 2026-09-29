"use client"

import { authClient } from "@/shared/api/auth-client"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from "@/shared/ui/item"
import { useState } from "react"
import { UpdateEmailDialog } from "./update-email-dialog"

export function AccountForm() {
  const { data: session } = authClient.useSession()
  const [isUpdateEmailDialogOpen, setIsUpdateEmailDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Аккаунт</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item size="xs">
              <ItemContent>
                <ItemTitle>Email</ItemTitle>
                <ItemDescription>{session?.user.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  disabled
                  variant="outline"
                  onClick={() => setIsUpdateEmailDialogOpen(true)}
                >
                  Изменить
                </Button>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item size="xs">
              <ItemContent>
                <ItemTitle>Имя</ItemTitle>
                <ItemDescription>{session?.user.name}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button disabled variant="outline" onClick={() => {}}>
                  Изменить
                </Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
      
      <UpdateEmailDialog
        open={isUpdateEmailDialogOpen}
        onOpenChange={setIsUpdateEmailDialogOpen}
      />
    </>
  )
}
