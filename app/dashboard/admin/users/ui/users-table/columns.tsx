import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { UserWithRole } from "better-auth/client/plugins"
import dayjs from "dayjs"
import { MoreHorizontal, TrashIcon } from "lucide-react"

type ColumnProps = {
  onDelete?: (user: UserWithRole) => void
}

export const getColumns = ({
  onDelete,
}: ColumnProps = {}): ColumnDef<UserWithRole>[] => [
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
          <DropdownMenuContent align="end">
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
