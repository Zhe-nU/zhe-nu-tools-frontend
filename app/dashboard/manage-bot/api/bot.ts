import { client } from "@/shared/api/client"
import { ChatType } from "../ui/settings-form"

export const getBot = async (userId: string) => {
  const { data } = await client.get(`/user/${userId}/bot`)
  return data
}

export const getBotSettings = (
  userId: string
): Promise<{ isActive: boolean }> => {
  return client.get(`/user/${userId}/bot/settings`)
}

export const updateBotSettings = async (
  userId: string,
  data: { isActive?: boolean; chatTypes?: Array<ChatType> }
) => {
  const { data: updatedData } = await client.patch(
    `/user/${userId}/bot/settings`,
    data
  )
  return updatedData
}
