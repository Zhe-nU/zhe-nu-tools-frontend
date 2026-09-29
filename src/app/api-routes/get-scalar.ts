import { ApiReference } from "@scalar/nextjs-api-reference"

const config = {
  url: process.env.NEXT_PUBLIC_OPENAPI_URL,
}

export const getScalar = ApiReference(config)
