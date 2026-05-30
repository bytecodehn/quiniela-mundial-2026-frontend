#!/usr/bin/env bash
# Deploy / actualiza el contenedor quiniela_frontend desde el repo clonado.
#
# Uso (en el servidor):
#   bash ~/apps/quiniela-mundial-2026-frontend/scripts/deploy.sh
#
# Variables que se pueden sobreescribir vía env:
#   BRANCH        rama a desplegar               (default: main)
#   IMAGE_TAG     tag de la imagen docker         (default: latest)
#   CONTAINER     nombre del contenedor           (default: quiniela_frontend)
#   HOST_PORT     puerto host a publicar          (default: 8090)
#   DOCKER_NET    red docker a la que se conecta  (default: quiniela_net)
#   API_URL       NEXT_PUBLIC_API_URL             (default: http://192.168.244.128:8888)
#   SITE_URL      NEXT_PUBLIC_SITE_URL            (default: http://192.168.244.128:8090)
#   USE_MOCKS     NEXT_PUBLIC_USE_MOCKS           (default: false)
#
# IMPORTANTE: el backend Go monta sus rutas en la RAÍZ (sin prefijo /api/v1).
# API_URL debe ser la URL del backend SIN /api/v1, y debe ser alcanzable desde
# el NAVEGADOR del usuario (no un hostname interno de docker), porque el cliente
# hace fetch client-side. En prod, pasá API_URL=https://api.tu-dominio y
# SITE_URL=https://tu-dominio, y asegurá que ese SITE_URL esté en FRONTEND_ORIGIN
# del backend (CORS). USE_MOCKS=false sirve la app real; true es solo demo/offline.

set -euo pipefail

BRANCH="${BRANCH:-main}"
CONTAINER="${CONTAINER:-quiniela_frontend}"
# El tag por defecto coincide con el nombre del contenedor para que cada
# despliegue (mainline / branch de validación / etc.) tenga su propia imagen
# y no se pisen entre ellos.
IMAGE_TAG="${IMAGE_TAG:-${CONTAINER}}"
HOST_PORT="${HOST_PORT:-8090}"
DOCKER_NET="${DOCKER_NET:-quiniela_net}"
API_URL="${API_URL:-http://192.168.244.128:8888}"
SITE_URL="${SITE_URL:-http://192.168.244.128:${HOST_PORT}}"
USE_MOCKS="${USE_MOCKS:-false}"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="quiniela_frontend:${IMAGE_TAG}"

log() { printf '\033[1;36m[deploy]\033[0m %s\n' "$*"; }

log "Repo:    $REPO_DIR"
log "Branch:  $BRANCH"
log "Image:   $IMAGE"
log "Port:    ${HOST_PORT} -> 3000"
log "Net:     $DOCKER_NET"

# 1. Update source
log "Actualizando código (git fetch + reset)..."
cd "$REPO_DIR"
git fetch --quiet origin "$BRANCH"
git reset --hard "origin/$BRANCH"
COMMIT="$(git rev-parse --short HEAD)"
log "Commit desplegado: $COMMIT"

# 2. Build image
log "Construyendo imagen docker..."
docker build \
  --build-arg NEXT_PUBLIC_USE_MOCKS="$USE_MOCKS" \
  --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" \
  --build-arg NEXT_PUBLIC_API_URL="$API_URL" \
  --build-arg NEXT_PUBLIC_ANALYTICS_DEBUG=false \
  -t "$IMAGE" \
  "$REPO_DIR"

# 3. Recreate container
log "Reemplazando contenedor $CONTAINER..."
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  --network "$DOCKER_NET" \
  -p "${HOST_PORT}:3000" \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e HOSTNAME=0.0.0.0 \
  --label "deploy.commit=$COMMIT" \
  --label "deploy.branch=$BRANCH" \
  "$IMAGE" >/dev/null

# 4. Smoke test
log "Esperando readiness..."
for i in $(seq 1 20); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:${HOST_PORT}/" || true)"
  if [ "$code" = "200" ]; then
    log "HTTP 200 ✓  (intento $i)"
    log "Listo: http://192.168.244.128:${HOST_PORT}/  ($COMMIT)"
    exit 0
  fi
  sleep 1
done

log "ERROR: el contenedor no respondió 200 tras 20s. Logs:"
docker logs --tail 40 "$CONTAINER"
exit 1
