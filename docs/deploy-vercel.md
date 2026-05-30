# Despliegue del frontend en Vercel

El frontend es una app Next.js **100% client-rendered** (sin `middleware`, sin
`app/api/`, sin fetch server-side; el token vive en `localStorage` y todas las
llamadas al backend son client-side). Por eso encaja perfecto en Vercel sin
cambios de código — solo variables de entorno.

> El `Dockerfile` y `scripts/deploy.sh` siguen sirviendo para el fallback en VPS
> (el contenedor `quiniela_frontend`). `next.config.ts` deja `output: "standalone"`
> para ese caso; **Vercel lo ignora** y usa su propio build nativo de Next.

## Los 3 entornos

| Entorno | Para qué | `NEXT_PUBLIC_USE_MOCKS` | `NEXT_PUBLIC_API_URL` | Backend |
|---|---|---|---|---|
| **Sponsor / Demo** | Mostrar la app al sponsor, clickable | `true` | (no se usa) | **ninguno** (fixtures + login demo) |
| **Comercial / Production** | Producto real | `false` | `https://api.<dominio>` | requerido (público) |
| **Preview (por PR)** | Review de cada cambio | `true` (recomendado) | — | ninguno si mocks |

**Login demo (modo mocks):** `carlos@example.com` / `password123`.

## Variables de entorno en Vercel

Se setean en *Project → Settings → Environment Variables*, scopeadas por entorno
(Production / Preview / Development). `NEXT_PUBLIC_*` se embeben en build-time.

**Production (Comercial):**
```
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_URL=https://api.<tu-dominio>     # SIN /api/v1 — el backend monta en la raíz
NEXT_PUBLIC_SITE_URL=https://<tu-dominio>
NEXT_PUBLIC_ANALYTICS_DEBUG=false
```

**Preview (demo del sponsor, sin backend):**
```
NEXT_PUBLIC_USE_MOCKS=true
```

> Alternativa para una URL de demo **estable**: un segundo proyecto Vercel
> apuntando a `main` con `NEXT_PUBLIC_USE_MOCKS=true`. Da un link fijo para el
> sponsor sin depender del backend ni de CORS.

## Pasos (Comercial)

1. **Importar** el repo en Vercel. Framework: Next.js (autodetectado). Root: raíz del repo. Build: `next build` (default). Node 20+.
2. Cargar las env vars de **Production** (arriba).
3. Conectar el **dominio** custom (Vercel emite TLS automático; agrega HSTS en dominios propios).
4. Deploy: push a `main` ⇒ Production; PRs ⇒ Preview automático.
5. **CORS del backend:** agregar el dominio de producción a `FRONTEND_ORIGIN`
   (acepta lista por coma) y redeployar el backend. Ej.:
   `FRONTEND_ORIGIN=https://<tu-dominio>`
6. Smoke: registro/login en el dominio → debe pegarle al backend real (revisar
   en DevTools que las requests van a `https://api.<dominio>` y responden 2xx).

## Caveats

- **Licencia:** el plan **Hobby (free) es no-comercial**. Para un producto
  comercial se necesita **Vercel Pro** (~US$20/mes). Cuenta del sponsor.
- **Preview contra backend real:** las URLs de preview cambian por deploy; CORS
  exige orígenes exactos. Si querés previews contra el backend real, usá un alias
  estable de Vercel y agregalo a `FRONTEND_ORIGIN`. El demo con mocks no tiene
  este problema (no llama al backend).
- **Backend NO va en Vercel** (Go long-running + Postgres + Redis). Va en
  Fly.io/Neon/Upstash (gestionado) o VPS+compose. Ver
  `docs/runbooks/production-launch.md` del repo backend.
