# Quiniela Mundial 2026 — Frontend

Plataforma social de predicciones para la Copa Mundial 2026. Construida con **Next.js 15 (App Router)**, **React 19**, **TypeScript** y **Tailwind CSS v4**.

## Requisitos

- Node.js 20+
- npm 10+ (o pnpm / yarn equivalentes)

## Setup

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local`:

- `NEXT_PUBLIC_API_URL` — URL base del backend (sin trailing slash). Default `/api/v1`.
- `NEXT_PUBLIC_USE_MOCKS` — `true` para usar fixtures locales mientras el backend no esté listo.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Levanta el servidor de desarrollo en `http://localhost:3000`. |
| `npm run build` | Genera el bundle de producción. |
| `npm run start` | Sirve el bundle de producción. |
| `npm run lint` | Corre ESLint. |
| `npm run typecheck` | Type-check sin emitir archivos. |
| `npm run format` | Aplica Prettier sobre `src/`. |
| `npm run test:e2e:install` | Descarga los navegadores de Playwright (una vez). |
| `npm run test:e2e` | Corre la suite E2E contra mocks (`NEXT_PUBLIC_USE_MOCKS=true`). |
| `npm run test:e2e:ui` | Corre la suite E2E con la UI interactiva de Playwright. |

## Estructura

```
src/
├── app/              # Rutas (App Router): páginas y layouts
├── components/
│   ├── ui/           # Primitivas de UI (Button, Card, Input, Toast, ...)
│   └── app-layout.tsx
├── lib/
│   ├── api.ts        # Cliente HTTP tipado contra /api/v1
│   ├── auth.tsx      # AuthProvider + hook useAuth()
│   ├── hooks/        # Data hooks (useMatches, usePredictions, ...)
│   └── fixtures/     # Mocks usados cuando NEXT_PUBLIC_USE_MOCKS=true
│       └── store.ts  # Persistencia mock con localStorage (mutaciones)
├── types/            # Tipos compartidos del dominio
e2e/                  # Suite E2E (Playwright) que corre contra mocks
docs/
├── prototypes/       # HTML originales de diseño
API.md                # Contrato del backend
```

## Contrato con el backend

El contrato completo (endpoints, payloads, reglas de scoring) vive en [API.md](./API.md). El cliente HTTP tipado está en [src/lib/api.ts](./src/lib/api.ts) y refleja ese contrato.

## Convenciones

- Páginas son **Client Components** (`"use client"` al tope) salvo que sean estáticas puras.
- Datos se consumen vía hooks en `src/lib/hooks/`, nunca importando fixtures directamente desde una página.
- Estilos usan tokens de Tailwind v4 definidos en `css/tokens.css` (`bg-bg-surface`, `text-fg`, etc.).
- El JWT se guarda en `localStorage` bajo la clave `token`.

## Tests E2E (Playwright)

La suite E2E corre **siempre contra mocks** (`NEXT_PUBLIC_USE_MOCKS=true`) para que no dependa del backend. La capa de fixtures en `src/lib/fixtures/store.ts` persiste mutaciones en `localStorage` durante cada sesión de test (groups, predictions, rules, user).

Primera vez en una máquina nueva:

```bash
npm install
npm run test:e2e:install   # descarga Chromium
```

Correr los tests:

```bash
npm run test:e2e           # headless, reporte en la terminal
npm run test:e2e:ui        # UI interactiva para debug
```

Playwright auto-arranca el dev server (`next dev` con `NEXT_PUBLIC_USE_MOCKS=true`). Si querés correr contra un server externo:

```bash
PLAYWRIGHT_BASE_URL=https://staging.example.com npm run test:e2e
```

Los flujos cubiertos hoy: login demo / register / logout, crear grupo, unirse con código, predecir resultado, perfil, leaderboard. Ver `e2e/*.spec.ts`.

Una **suite separada `@backend`** (sin implementar todavía) correrá contra backend real cuando esté disponible.
