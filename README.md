# hearth

A custom smart home control app powered by [Home Assistant](https://www.home-assistant.io/). Replaces the default HA frontend with a purpose-built UI while Home Assistant handles device orchestration, integrations, state, and automations.

## Architecture

```
Home Assistant (WebSocket + REST API)
        │
        │  single connection, server-side
        │
   apps/server (BFF)
   ├── Hono HTTP + WebSocket
   ├── tRPC (type-safe RPC)
   ├── Drizzle + SQLite (users, auth, config)
   ├── JWT auth + RBAC (admin/user/guest/wall-panel)
   └── WebSocket fan-out (filtered by role)
        │
        │  tRPC over HTTP + WebSocket (state events)
        │
   apps/web (React SPA)          apps/desktop (Electron shell)
   ├── TanStack Router            └── loads web app
   ├── TanStack React Query           secure session storage
   ├── Zustand
   ├── shadcn/ui + Tailwind
   └── tRPC client
```

**Key design decisions:**

- HA token stored server-side only - never in the browser
- BFF manages multi-user auth, RBAC filtering, and WebSocket fan-out
- Single HA connection shared across all users
- `@hearth/ha-client` wraps `home-assistant-js-websocket` behind an abstraction
- `@hearth/domain` provides shared types, roles, and state interpreters with zero deps

## Monorepo Structure

```
apps/
  server/     BFF — Hono + tRPC + Drizzle/SQLite
  web/        React SPA — Vite + TanStack + shadcn/ui
  desktop/    Electron shell
packages/
  domain/     Shared types, roles, commands, state interpreters
  ha-client/  Home Assistant WebSocket/REST client abstraction
```

## Stack

| Layer     | Tech                                                             |
| --------- | ---------------------------------------------------------------- |
| Monorepo  | Turborepo + Bun                                                  |
| Server    | Hono, tRPC, Drizzle, SQLite, Pino                                |
| Auth      | JWT (hono/jwt) + argon2 (Bun.password)                           |
| Web       | React 19, TanStack Router/Query, Zustand, shadcn/ui, Tailwind v4 |
| Desktop   | Electron                                                         |
| HA Client | home-assistant-js-websocket                                      |
| Linting   | oxlint + oxfmt                                                   |
| Testing   | Vitest                                                           |

## Getting Started

```bash
bun install
bun run dev:server   # start BFF on :3001
bun run dev:web      # start web app on :5173
```

Set `HEARTH_JWT_SECRET` environment variable before starting the server.

On first run, use the setup endpoint to create the initial admin user.

## Scripts

```bash
bun run dev           # all apps
bun run build         # build all
bun run typecheck     # typecheck all packages
bun run lint          # oxlint
bun run lint:fix      # oxlint --fix
bun run format        # oxfmt
bun run format:check  # oxfmt --check
bun run test          # vitest across all packages
```

## Device Support

Lights, switches, sensors, binary sensors, climate, covers/blinds, locks, scenes. Cameras and media players planned for a future release.

## License

[MIT](LICENSE)
