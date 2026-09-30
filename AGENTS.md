# AGENTS.md

## Commands

- `pnpm dev` — dev server on port **3010** (not 3000), turbopack
- `pnpm build` — production build (standalone output)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — eslint only
- `pnpm format` — prettier (ts/tsx only)
- `pnpm generate:api` — orval codegen (see below)
- No test runner is configured.

## API codegen (orval)

`src/shared/api/endpoints/`, `src/shared/api/models/`, and `src/shared/api/zod/` are **generated** from the backend OpenAPI spec. Do not hand-edit.

`pnpm generate:api` requires the backend running at `localhost:3011` (reads `/api-json`). It generates react-query hooks + axios client + zod schemas + msw mocks.

Custom axios instance with 401 redirect is in `src/shared/api/client.ts`.

## Architecture (Feature-Sliced Design)

`app/` (Next.js App Router) contains **thin route files only** — they import page components from `src/pages/`. All real logic lives under `src/`.

Layer aliases (all resolve to `./src/<layer>/*`):

- `@shared/*` — UI primitives, lib, api client, generated code
- `@features/*` — user-facing features (forms, dialogs)
- `@widgets/*` — composite components (layouts, lists, settings panels)
- `@pages/*` — page components (assembled from widgets)
- `@entities/*`, `@processes/*` — defined in tsconfig but not yet used

## shadcn/ui

Components install into `src/shared/ui/` (not the default `components/`). Install with:

```bash
npx shadcn@latest add <component>
```

`components.json` configures this. Style: `radix-nova`, icons: `lucide`.

## Auth

Uses **better-auth** (not NextAuth). Client: `src/shared/api/auth-client.ts`. Session hook: `authClient.useSession()`. Admin plugin is enabled.

## Env

Copy `.env.example` to `.env`. Required: `NEXT_PUBLIC_API_BASE_URL`. All `NEXT_PUBLIC_*` vars are baked at build time (Docker build args).

## Gotchas

- `pnpm-workspace.yaml` exists but this is **not** a multi-package monorepo — it only configures `allowBuilds`.
- `pages/` dir exists with only a README; all routes use App Router under `app/`.
- ESLint disables `react/no-children-prop` intentionally (used for Radix Select children patterns).

## Development Guidelines

For FSD code style and best practices: https://fsd.how/llms.txt
