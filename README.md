# Idioglossia.lang

A minimal TypeScript monorepo for interactive and real-time art experiments. It pairs a Vite-powered React client with an Express and Socket.IO server, while keeping shared event contracts in one small package.

## Requirements

- Node.js 22 or later
- npm 10 or later

## Setup

```bash
npm install
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

## Development

```bash
npm run dev
```

The client runs at `http://localhost:5173`, and the server runs at `http://localhost:3001`. The client proxies `/api` requests to the server and connects to it through Socket.IO.

## Scripts

| Command             | Purpose                            |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Run the client and server together |
| `npm run build`     | Build all workspaces               |
| `npm run typecheck` | Type-check all workspaces          |
| `npm run lint`      | Lint TypeScript and React source   |

## Structure

- `apps/client` — React/Vite canvas for experimental interfaces and creative coding.
- `apps/server` — Express and Socket.IO infrastructure for real-time interactions.
- `packages/shared` — Shared application and Socket.IO event contracts.

## Environment

Server settings live in `apps/server/.env`; client settings live in `apps/client/.env`. The committed `.env.example` files document the available values. Add creative libraries only when an experiment needs them, so the foundation stays open and lightweight.
