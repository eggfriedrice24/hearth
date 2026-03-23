# Contributing

Thanks for your interest in contributing to hearth.

## Development Setup

```bash
git clone https://github.com/eggfriedrice24/hearth.git
cd hearth
bun install
```

## Workflow

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run checks before pushing:
   ```bash
   bun run lint
   bun run format:check
   bun run typecheck
   bun run test
   ```
4. Open a pull request against `main`

## Conventions

- **File naming**: kebab-case (enforced by `unicorn/filename-case`)
- **Formatting**: oxfmt — run `bun run format` before committing
- **Linting**: oxlint — zero warnings policy
- **Types**: strict TypeScript with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- **Commits**: single-line, lowercase, imperative mood (`add login page`, `fix reconnect handling`)
- **Imports**: use `~/` alias for app-internal imports in `apps/server` and `apps/web`

## Project Layout

- `packages/domain` — shared types and logic, zero dependencies
- `packages/ha-client` — Home Assistant client abstraction
- `apps/server` — BFF (Hono + tRPC + Drizzle)
- `apps/web` — React SPA
- `apps/desktop` — Electron shell

When adding new tRPC procedures, create a folder under `apps/server/src/trpc/procedures/` with its own `router.ts` and `validations.ts`.

## Reporting Issues

Open an issue on GitHub with steps to reproduce.
