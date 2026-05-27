# Despliegue en servidor DEV

Servidor frontend DEV: `192.168.74.128`  
URL de prueba: `http://192.168.74.128:3000/`  
Ruta del proyecto: `/home/aduenas/apps/quiniela-mundial-2026-frontend`

## 1. Conectarse por SSH

```bash
ssh aduenas@192.168.74.128
```

Si se usa una llave privada especifica:

```bash
ssh -i ~/.ssh/id_ed25519 aduenas@192.168.74.128
```

## 2. Ir al proyecto

```bash
cd /home/aduenas/apps/quiniela-mundial-2026-frontend
```

## 3. Verificar Node y npm

```bash
node -v
npm -v
```

Versiones esperadas o similares:

```bash
v24.16.0
11.13.0
```

Si `node` no aparece, cargar el PATH del usuario:

```bash
source ~/.bashrc
```

## 4. Actualizar codigo

Si se reemplazan archivos manualmente, subirlos a:

```bash
/home/aduenas/apps/quiniela-mundial-2026-frontend
```

Si el repo ya esta conectado con Git:

```bash
git pull
```

## 5. Revisar variables de entorno

```bash
cat .env.production
```

Debe tener algo similar a:

```bash
NEXT_PUBLIC_API_URL=/api/v1
NEXT_PUBLIC_USE_MOCKS=
```

## 6. Instalar dependencias

Preferido si el lockfile esta sincronizado:

```bash
npm ci
```

Si falla por lockfile desactualizado:

```bash
npm install
```

## 7. Validar TypeScript

```bash
npm run typecheck
```

## 8. Compilar produccion

```bash
npm run build
```

## 9. Reiniciar servicio

```bash
systemctl --user restart quiniela-frontend.service
```

## 10. Ver estado del servicio

```bash
systemctl --user status quiniela-frontend.service
```

## 11. Ver logs

```bash
journalctl --user -u quiniela-frontend.service -f
```

## 12. Probar en navegador

Abrir:

```text
http://192.168.74.128:3000/
```

Tambien se puede validar desde el servidor:

```bash
curl -I http://127.0.0.1:3000/
```

Respuesta esperada:

```text
HTTP/1.1 200 OK
```

## 13. Tests E2E (opcional)

Suite Playwright que corre contra mocks; no requiere backend.

### Primera vez en el servidor Fedora

Playwright no soporta oficialmente Fedora, asi que la instalacion de libs del sistema y del navegador van por separado.

1. Instalar las libs del sistema con `dnf` (una vez):

```bash
sudo dnf install -y \
  alsa-lib atk at-spi2-atk at-spi2-core cups-libs libdrm libxkbcommon \
  mesa-libgbm nss pango gtk3 libXcomposite libXdamage libXfixes libXrandr \
  libXcursor cairo
```

2. Descargar el binario de Chromium de Playwright (no requiere root):

```bash
npm run test:e2e:install
```

### Correr la suite

```bash
npm run test:e2e
```

Playwright auto-arranca un dev server con `NEXT_PUBLIC_USE_MOCKS=true`. Para correr contra un server ya levantado en otra URL:

```bash
PLAYWRIGHT_BASE_URL=http://192.168.74.128:3000 npm run test:e2e
```

### Troubleshooting

Si al correr los tests aparece un error como `error while loading shared libraries: libnss3.so` o similar, falta alguna lib del paso 1. Instalala con `dnf` y reintenta.

Nota: la suite asume mocks. Una suite separada con tag `@backend` se agregara cuando exista backend.

## 14. Auditoria Lighthouse (opcional, pre-adquisicion)

Antes de campanas de adquisicion o de cualquier publico amplio, conviene correr Lighthouse contra el deploy DEV y registrar baseline de Core Web Vitals.

Desde una maquina con Chrome / Chromium:

```bash
npx lighthouse http://192.168.74.128:3000/ \
  --only-categories=performance,accessibility,best-practices,seo,pwa \
  --output=html \
  --output-path=./lighthouse-dev.html
```

Que vigilar:

- **LCP** (Largest Contentful Paint) < 2.5s.
- **CLS** (Cumulative Layout Shift) < 0.1.
- **INP** (Interaction to Next Paint) < 200ms.
- **PWA**: con la app instalada via manifest, el badge de "Instalar" deberia aparecer en Chrome.

Si Lighthouse marca rojo en imagenes, el siguiente paso es introducir `next/image` cuando haya assets reales (banderas, logos de selecciones, etc.). Hoy la app usa emojis y no tiene activos pesados.

El Service Worker (`public/sw.js`) solo se registra en `NODE_ENV=production`, asi que para validar PWA hay que correr contra el build de produccion (`npm run build && npm run start`).

## Checklist rapido

- SSH exitoso.
- `node -v` y `npm -v` responden.
- `.env.production` revisado.
- Dependencias instaladas con `npm ci` o `npm install`.
- `npm run typecheck` sin errores.
- `npm run build` sin errores.
- Servicio reiniciado.
- `systemctl --user status quiniela-frontend.service` en estado saludable.
- `curl -I http://127.0.0.1:3000/` responde `200 OK`.
- (Opcional) `npm run test:e2e` en verde.

## Troubleshooting

### `node` o `npm` no aparecen

```bash
source ~/.bashrc
node -v
npm -v
```

### El build falla por dependencias

Primero intentar:

```bash
npm ci
```

Si el lockfile no coincide con `package.json`:

```bash
npm install
```

Luego repetir:

```bash
npm run typecheck
npm run build
```

### El servicio no levanta

Revisar estado:

```bash
systemctl --user status quiniela-frontend.service
```

Revisar logs en vivo:

```bash
journalctl --user -u quiniela-frontend.service -f
```
