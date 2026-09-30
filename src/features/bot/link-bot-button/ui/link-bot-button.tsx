import { Button } from "@/shared/ui/button"
import Link from "next/link"

export function LinkBotButton() {
  return (
    <Button asChild>
      <Link
        href={`https://www.avito.ru/oauth?response_type=code&client_id=${process.env.NEXT_PUBLIC_AVITO_CLIENT_ID}&scope=user:read,messenger:read,messenger:write,items:info,stats:read`}
        target="_blank"
      >
        Подключить бота
      </Link>
    </Button>
  )
}
