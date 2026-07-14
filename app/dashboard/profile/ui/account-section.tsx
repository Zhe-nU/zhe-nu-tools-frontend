"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { UpdateEmailDialog } from "./update-email-dialog"

export function AccountSection() {
  const { data: session } = authClient.useSession()
  const [isUpdateEmailDialogOpen, setIsUpdateEmailDialogOpen] = useState(false)

  return (
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
                variant="outline"
                onClick={() => setIsUpdateEmailDialogOpen(true)}
              >
                Изменить
              </Button>
            </ItemActions>
            <UpdateEmailDialog
              open={isUpdateEmailDialogOpen}
              onOpenChange={setIsUpdateEmailDialogOpen}
            />
          </Item>
          <ItemSeparator />
          <Item size="xs">
            <ItemContent>
              <ItemTitle>Имя</ItemTitle>
              <ItemDescription>{session?.user.name}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                onClick={() => setIsUpdateEmailDialogOpen(true)}
              >
                Изменить
              </Button>
            </ItemActions>
            <UpdateEmailDialog
              open={isUpdateEmailDialogOpen}
              onOpenChange={setIsUpdateEmailDialogOpen}
            />
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
