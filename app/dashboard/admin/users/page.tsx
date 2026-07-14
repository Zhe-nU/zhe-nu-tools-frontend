"use client"

import { authClient } from "@/lib/auth-client"
import { UsersTable } from "./ui/users-table/table"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getColumns } from "./ui/users-table/columns"
import { UserWithRole } from "better-auth/client/plugins"
import { toast } from "sonner"

export default function Page() {
  const { data: session } = authClient.useSession()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bot", session!.user.id],
    queryFn: () => authClient.admin.listUsers({ query: {} }),
  })

  const banUserMutation = useMutation({
    mutationFn: (opts: Parameters<typeof authClient.admin.banUser>[0]) =>
      authClient.admin.banUser(opts),
  })

  const deleteUserMutation = useMutation({
    mutationFn: (user: UserWithRole) =>
      authClient.admin.removeUser({ userId: user.id }),
  })

  const unbanUserMutation = useMutation({
    mutationFn: (opts: Parameters<typeof authClient.admin.unbanUser>[0]) =>
      authClient.admin.unbanUser(opts),
  })

  const handleBan = async (
    opts: Parameters<typeof authClient.admin.banUser>[0]
  ) => {
    await banUserMutation.mutateAsync(opts)

    await refetch()

    toast.success("Пользователь заблокирован")
  }

  const handleDelete = async (user: UserWithRole) => {
    await deleteUserMutation.mutateAsync(user)

    await refetch()

    toast.success("Пользователь удален")
  }

  const handleUnban = async (
    opts: Parameters<typeof authClient.admin.unbanUser>[0]
  ) => {
    await unbanUserMutation.mutateAsync(opts)

    await refetch()

    toast.success("Пользователь разблокирован")
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data?.data && (
        <div className="container mx-auto py-10">
          <UsersTable
            columns={getColumns({
              onBan: handleBan,
              onDelete: handleDelete,
              onUnban: handleUnban,
            })}
            data={data.data?.users}
          />
        </div>
      )}
    </div>
  )
}
