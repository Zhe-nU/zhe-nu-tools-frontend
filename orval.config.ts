import { defineConfig } from "orval"

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:3011/api-json",
    },
    output: {
      clean: true,
      mode: "tags-split",
      target: "app/client/endpoints",
      schemas: "app/client/models",
      client: "react-query",
      httpClient: "axios",
      mock: true,
      override: {
        mutator: {
          path: "./shared/api/client.ts",
          name: "customInstance",
        },
      },
    },
  },
  apiZod: {
    input: {
      target: "http://localhost:3011/api-json",
    },
    output: {
      mode: "split",
      client: "zod",
      target: "app/client/zod/endpoints",
      schemas: "app/client/zod/models",
      fileExtension: ".zod.ts",
    },
  },
})
