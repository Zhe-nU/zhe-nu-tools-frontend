import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { ColumnDef } from "@tanstack/react-table"
import { UserWithRole } from "better-auth/client/plugins"
import dayjs from "dayjs"
import {
  BanIcon,
  CheckIcon,
  LogInIcon,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react"

type ColumnProps = {
  onBan?: (opts: Parameters<typeof authClient.admin.banUser>[0]) => void
  onDelete?: (user: UserWithRole) => void
  onUnban?: (opts: Parameters<typeof authClient.admin.unbanUser>[0]) => void
}

export const getColumns = ({
  onBan,
  onDelete,
  onUnban,
}: ColumnProps = {}): ColumnDef<UserWithRole>[] => [
  {
    accessorKey: "banned",
    header: () => (
      <div className="flex justify-center">
        <LogInIcon size={16}></LogInIcon>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.banned ? (
          <BanIcon size={16} className="text-destructive" />
        ) : (
          <CheckIcon size={16} />
        )}
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "role",
    header: "Роль",
  },
  {
    accessorFn: (row) => dayjs(row.createdAt).format("DD.MM.YYYY HH:mm:ss"),
    header: "Дата регистрации",
  },
  {
    accessorFn: (row) => dayjs(row.updatedAt).format("DD.MM.YYYY HH:mm:ss"),
    header: "Последнее обновление",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              variant={!row.original.banned ? "destructive" : "default"}
              onClick={() =>
                !row.original.banned
                  ? onBan?.({ userId: row.original.id })
                  : onUnban?.({ userId: row.original.id })
              }
            >
              <BanIcon />
              {!row.original.banned ? "Заблокировать" : "Разблокировать"}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete?.(row.original)}
            >
              <TrashIcon />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
