import { defineConfig } from "orval"

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:3011/api-json",
    },
    output: {
      clean: true,
      mode: "tags-split",
      target: "./src/shared/api/endpoints",
      schemas: "./src/shared/api/models",
      client: "react-query",
      httpClient: "axios",
      mock: true,
      override: {
        mutator: {
          path: "./src/shared/api/client.ts",
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
      target: "./src/shared/api/zod/endpoints",
      schemas: "./src/shared/api/zod/models",
      fileExtension: ".zod.ts",
    },
  },
})
