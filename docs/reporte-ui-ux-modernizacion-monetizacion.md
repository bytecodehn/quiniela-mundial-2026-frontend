# Reporte UI/UX, modernizacion y monetizacion

Fecha de analisis: 2026-05-27  
Repositorio: `quiniela-mundial-2026-frontend`

## Resumen ejecutivo

La plataforma ya tiene una base solida: Next.js 15, React 19, TypeScript, Tailwind v4, un sistema visual propio, rutas publicas, rutas autenticadas, dashboard, partidos, predicciones, ranking, grupos privados, perfil y panel de administracion. El producto comunica bien la idea central: una quiniela social del Mundial 2026 basada en predicciones, puntos, rankings y grupos.

La mayor oportunidad no esta en "hacer mas pantallas", sino en cerrar la experiencia competitiva completa: onboarding, prediccion rapida, seguimiento de progreso, invitacion social, confianza, accesibilidad y monetizacion sin convertirlo en apuestas. Hoy el flujo funciona como prototipo avanzado, pero todavia le faltan capas de producto medible y monetizable.

Prioridades recomendadas:

1. Corregir fricciones de confianza y consistencia: accesibilidad, datos no persistidos, botones simulados y mutaciones con errores silenciosos.
2. Optimizar el flujo principal: descubrir partido, predecir, guardar, compartir, volver a competir.
3. Convertir grupos privados en motor de crecimiento y monetizacion.
4. Definir contrato backend de pagos, planes, sponsors y cupones antes de construir pantallas de monetizacion.
5. Agregar telemetria, testing, SEO/i18n/PWA y experimentacion antes de invertir fuerte en adquisicion.

## Alcance revisado

Se revisaron:

- Rutas principales en `src/app`: landing, login, register, dashboard, matches, match detail, predictions, leaderboard, groups, profile y admin.
- Componentes compartidos en `src/components/ui` y layout de aplicacion en `src/components/app-layout.tsx`.
- Contrato de API en `API.md`.
- Tipos, hooks, fixtures y cliente HTTP en `src/lib` y `src/types`.
- Tokens y prototipos en `css/tokens.css` y `docs/prototypes`.

Validacion en servidor DEV:

- En el ambiente local de VS Code, `node`, `npm` y `git` no estan disponibles por PATH; ese entorno se usa solo para programacion.
- En el servidor DEV `192.168.74.128`, `node`, `npm` y `git` si estan disponibles.
- `npm run typecheck` paso correctamente en DEV.
- `npm run build` paso correctamente en DEV.
- `npm run lint` paso correctamente en DEV, sin warnings ni errores.
- `git status --short` en DEV solo reporto `.env.production` como archivo no trackeado.

## Estado actual del producto

### Fortalezas

- Producto claro y facil de entender: predicciones, puntos, ranking y grupos.
- Landing con propuesta directa y CTAs visibles en `src/app/page.tsx:102`, `src/app/page.tsx:107` y `src/app/page.tsx:117`.
- Sistema visual consistente con tokens de color, spacing, radius y componentes base en `src/app/globals.css` y `css/tokens.css`.
- Arquitectura funcional para crecer: rutas por dominio, hooks de datos y contrato API documentado.
- Foundation de data fetching ya encaminado con hooks en `src/lib/hooks`, cliente HTTP tipado y `NEXT_PUBLIC_USE_MOCKS` para alternar fixtures/backend.
- Panel admin ya contempla usuarios, partidos, reglas de puntuacion y grupos en `src/lib/api.ts:81` a `src/lib/api.ts:115`.
- Mecanica social fuerte: grupos privados, codigos de invitacion, rankings de grupo y ranking global.

### Riesgos principales

- Varias experiencias aparentan estar completas pero son simuladas o incompletas.
- Hay dependencia fuerte de emojis para iconos y banderas, lo que afecta consistencia visual entre plataformas.
- Faltan patrones de accesibilidad en botones icon-only, modales, tabs y labels de inputs.
- La monetizacion no existe en el producto ni en el contrato API.
- No hay contrato backend para pagos, suscripciones, planes, cupones o sponsors; monetizacion no es solo trabajo frontend.
- Varias mutaciones fallan silenciosamente o solo hacen `console.error`, lo que rompe confianza en flujos criticos.
- No hay estrategia visible de i18n, SEO/OG, PWA/push ni medicion de Core Web Vitals para capturar mercado pre-Mundial.
- El admin muestra volumen operativo, pero no embudos, cohortes, conversion, retencion ni revenue.

## Hallazgos UI/UX

### 1. La identidad visual es consistente, pero demasiado generica para un Mundial

El tema oscuro con verde/cyan/gold funciona para una app competitiva, pero la experiencia podria sentirse mas futbolera y menos dashboard generico. El hero usa gradientes y texto, pero no activos visuales relevantes del torneo o del comportamiento principal de la app.

Evidencia:

- Hero con fondo radial/gradiente en `src/app/page.tsx:98`.
- Marca basada principalmente en una "Q" y gradientes en `src/app/page.tsx:43`.
- Iconos como emojis en features y navegacion en `src/app/page.tsx:15` a `src/app/page.tsx:18`, `src/components/app-layout.tsx:8` a `src/components/app-layout.tsx:13`.

Mejora:

- Crear una direccion visual mas propia: tarjetas de partidos con banderas/escudos visuales consistentes, fondo editorial deportivo, microinteracciones de marcador y estados de partido.
- Reemplazar emojis por iconos consistentes, por ejemplo `lucide-react`, y banderas con assets o CDN controlado.
- Mantener el dark mode como modo principal, pero sumar superficies claras en formularios, tablas y rankings para mejorar lectura prolongada.

### 2. El flujo principal necesita reducir pasos

El usuario quiere predecir rapido. Actualmente debe entrar a partidos, filtrar, abrir detalle, escribir marcador y guardar. La tarjeta de partido en `MatchCard` podria permitir prediccion inline para partidos proximos.

Evidencia:

- `MatchCard` solo muestra boton "Predecir" si recibe `onPredict` y el partido esta upcoming en `src/components/ui/MatchCard.tsx:34`.
- La captura del marcador vive solo en detalle de partido en `src/app/matches/[id]/page.tsx:145` a `src/app/matches/[id]/page.tsx:167`.

Mejora:

- Permitir prediccion inline desde calendario y dashboard.
- Agregar bulk prediction para "predecir todos los partidos del dia".
- Mostrar estado "Ya predicho" en tarjetas de partido, no solo en historial.
- Agregar confirmacion persistente con opcion de editar mientras el deadline siga abierto.

### 3. Dashboard: buen resumen, falta urgencia accionable

El dashboard muestra puntos, ranking y pendientes, pero la accion mas importante deberia ser "predicciones que cierran pronto".

Evidencia:

- Stat de predicciones pendientes en `src/app/dashboard/page.tsx:51`.
- Proximos partidos se muestran como lista dentro de `src/app/dashboard/page.tsx`; tras el refactor, las lineas exactas pueden variar, pero el patron sigue siendo lista/resumen y no una cola priorizada por deadline.

Mejora:

- Ordenar proximos partidos por deadline, no solo por fecha.
- Agregar bloque "Cierra pronto" con countdown visible.
- Mostrar progreso: "8/64 partidos predichos", "te faltan 3 de esta jornada".
- Mostrar impacto: "si aciertas este partido podrias subir hasta #12".

### 4. Landing: buena conversion inicial, pero hay claims de confianza sin respaldo

Se muestran numeros grandes como "50K+", "890K+" y "8K+" que pueden aumentar conversion, pero si son mock o no estan respaldados pueden deteriorar confianza.

Evidencia:

- `50K+` en landing en `src/app/page.tsx:127`.
- `50K+`, `890K+`, `8K+` en login en `src/app/login/page.tsx:51` a `src/app/login/page.tsx:53`.

Mejora:

- Si son reales, conectarlos a API/admin.
- Si son aspiracionales, reemplazarlos por metricas verificables: "64 partidos", "grupos privados", "ranking en vivo".
- Agregar trust copy: sin apuestas, sin dinero real, reglas transparentes.

### 5. Registro y perfil tienen datos que no se guardan

El registro captura `country`, pero el payload enviado a `register` no lo incluye. El perfil permite editar datos, pero `handleSave` solo muestra estado local y no llama `api.updateMe`.

Evidencia:

- Estado `country` en registro en `src/app/register/page.tsx:39`.
- Llamada a `register` sin `country` en `src/app/register/page.tsx:58`.
- API acepta `country` en `src/lib/api.ts:26`.
- Perfil tiene `handleSave` local en `src/app/profile/page.tsx:70`.
- API ya tiene `updateMe` en `src/lib/api.ts:37`.

Mejora:

- Enviar `country` en registro.
- Implementar guardado real de perfil.
- Agregar feedback de error si falla.
- Agregar estado de cambios pendientes y boton deshabilitado cuando no hay cambios.

### 6. Login incluye una accion que parece Google pero rellena credenciales demo

El boton "Google" no autentica con Google. Rellena email y password demo.

Evidencia:

- `setEmail("carlos@example.com")` y `setPassword("password123")` en `src/app/login/page.tsx:128` a `src/app/login/page.tsx:130`.
- Texto visible "Google" en `src/app/login/page.tsx:134`.

Mejora:

- Cambiar a "Usar cuenta demo" si se mantiene para pruebas.
- Implementar OAuth real si se quiere prometer login social.
- En entornos productivos, ocultar accesos demo.

### 7. Ranking por grupo no esta implementado aunque aparece como tab

La pagina de ranking tiene tab "Por grupo", pero no se observa cambio de fuente de datos ni selector de grupo.

Evidencia:

- `activeTab` en `src/app/leaderboard/page.tsx:40`.
- Tabs "Ranking Global" y "Por grupo" en `src/app/leaderboard/page.tsx:55`.
- API ya tiene `getGroupLeaderboard` en `src/lib/api.ts:63`.

Mejora:

- Implementar selector de grupo al cambiar a "Por grupo".
- Mostrar ranking contextual dentro de cada grupo y enlace desde card de grupo.
- Agregar ranking por pais, amigos y seleccion favorita como variantes futuras.

### 8. Accesibilidad incompleta

Hay pocos atributos `aria-*` en el codigo. Los botones de menu, notificaciones, admin, cerrar modal y algunos iconos no tienen nombre accesible claro. Los labels de `Input` no usan `htmlFor` ni `id`.

Evidencia:

- Solo se encontraron usos de `aria-hidden` en `src/components/ui/ErrorState.tsx` y `src/components/ui/Skeleton.tsx`.
- Boton de menu mobile sin `aria-label` en `src/components/app-layout.tsx:112`.
- Boton de notificacion icon-only en `src/components/app-layout.tsx:132`.
- Cerrar modal sin `aria-label` en `src/components/ui/Modal.tsx:28`.
- `Input` renderiza `<label>` sin asociarlo al input en `src/components/ui/Input.tsx:8` a `src/components/ui/Input.tsx:13`.

Mejora:

- Agregar `aria-label` a icon-only buttons.
- Convertir `Tabs` a patron accesible con `role="tablist"`, `role="tab"` y `aria-selected`.
- Asociar labels e inputs con `useId`.
- En `Modal`, agregar `role="dialog"`, `aria-modal`, foco inicial, cierre con Escape y focus trap.

### 9. La UI mobile esta cubierta, pero se duplica navegacion

En mobile hay bottom nav y tambien un menu desplegable desde header. Esto puede ser util, pero hoy duplica rutas y puede crear indecision.

Evidencia:

- `MobileNav` en `src/components/app-layout.tsx:79`.
- Menu mobile desplegable en `src/components/app-layout.tsx:144`.

Mejora:

- Usar bottom nav para las 5 rutas principales.
- Reservar menu del header para perfil, admin, logout, ajustes y ayuda.
- Agregar estado de usuario y puntos en mobile header.

### 10. Admin es funcional, pero no operativo para crecimiento

El admin muestra volumen: usuarios, grupos, predicciones, partidos. Para monetizar, se necesitan vistas de embudo, conversion, retencion y cohortes.

Evidencia:

- Metricas admin en `src/app/admin/page.tsx:31`, `src/app/admin/page.tsx:37`, `src/app/admin/page.tsx:40`, `src/app/admin/page.tsx:55`.
- Tipos `AdminStats` en `src/types/index.ts:117`.

Mejora:

- Agregar panel de crecimiento: registros/dia, activacion, usuarios con 1+ prediccion, usuarios en grupo, invitaciones enviadas, invitaciones aceptadas.
- Agregar monetizacion: revenue, conversion premium, ARPU, compras por grupo, sponsors activos.
- Agregar moderacion de grupos y reportes.

### 11. Monetizacion requiere contrato backend antes de UI

La estrategia de planes premium, checkout, billing, sponsors y cupones es viable, pero el contrato actual no expone endpoints para pagos ni suscripciones. Sin esa definicion, cualquier pantalla premium seria prototipo sin capacidad operativa.

Evidencia:

- `API.md` cubre auth, partidos, predicciones, leaderboard, grupos, admin y reglas, pero no pagos, planes, suscripciones, invoices, webhooks, sponsors ni cupones.
- `src/lib/api.ts` no contiene metodos de billing, checkout, plan management ni sponsor placements.

Mejora:

- Definir primero el contrato backend de monetizacion.
- Elegir proveedor de pagos segun pais objetivo: Stripe, Mercado Pago, Wompi u otro.
- Incluir webhooks, estados de pago, cancelacion, upgrades/downgrades, facturacion, cupones y auditoria admin.

### 12. Internacionalizacion pendiente

La aplicacion esta escrita en espanol rioplatense. Eso puede ser correcto para un primer mercado, pero limita alcance para un Mundial en Estados Unidos, Canada y Mexico, y tambien deja fuera oportunidades en Brasil.

Mejora:

- Definir estrategia i18n desde ahora: `es`, `en`, `pt-BR` como minimo si el objetivo es regional/global.
- Separar copy de componentes antes de que crezca el producto.
- Evitar hardcodear variantes locales en mensajes criticos si la app apunta a multiples paises.

### 13. SEO, Open Graph y shareability faltan como palanca de adquisicion

La landing puede captar trafico organico pre-Mundial, pero necesita metadata social, canonicidad y contenido compartible. El producto tambien deberia producir share cards para rankings, grupos y predicciones.

Mejora:

- Agregar `og:title`, `og:description`, `og:image`, Twitter Cards y `canonical`.
- Evaluar JSON-LD donde aplique para eventos/calendario y contenido deportivo.
- Crear imagenes sociales para grupos y rankings.
- Medir conversion desde shares e invitaciones.

### 14. PWA, notificaciones y performance no estan cubiertas

El reporte recomienda recordatorios antes de deadlines, pero email por si solo puede ser debil. Para una quiniela, Web Push y PWA pueden aumentar retorno diario durante el torneo. Tambien falta analisis de Core Web Vitals, LCP, CLS y peso de bundle.

Mejora:

- Evaluar PWA con service worker, manifest y Web Push para deadlines.
- Usar email como respaldo, no como unico canal.
- Auditar bundle, LCP, CLS e INP antes de campanas de adquisicion.
- Introducir `next/image` cuando se incorporen activos reales de producto/landing.

## Modernizacion tecnica recomendada

### Alta prioridad

- Mantener `npm run typecheck`, `npm run build` y `npm run lint` en CI; en DEV ya pasaron correctamente.
- Reemplazar acciones simuladas por endpoints reales o estados explicitamente demo.
- Agregar manejo visible de errores en mutaciones. Hoy `submitPrediction`, `createGroup`, `joinGroup`, `updateAdminUserStatus` y `saveRules` pueden fallar con feedback insuficiente o solo `console.error`.
- Corregir persistencia real de registro/perfil: enviar `country` y usar `api.updateMe`.
- Definir contrato backend de monetizacion antes de construir checkout, planes o sponsors en frontend.
- Agregar pruebas E2E del flujo critico: registro/login, crear prediccion, crear grupo, unirse a grupo y ranking.
- Evaluar migracion de JWT a cookies HTTP-only como cambio coordinado con backend. Requiere `Set-Cookie`, `SameSite`, estrategia CSRF y manejo de expiracion; no es un cambio frontend aislado.

### Media prioridad

- Unificar componentes `Select` y selects nativos duplicados en registro/perfil.
- Agregar libreria de iconos consistente.
- Crear componentes especificos de dominio: `PredictionInline`, `DeadlineBadge`, `GroupInviteCard`, `LeaderboardTable`, `AdminDataTable`.
- Extender paginacion desde la capa existente de hooks/API, por ejemplo `useMatches({ page })`, en lugar de construir un sistema nuevo.
- Implementar i18n para `es`, `en` y `pt-BR` si el mercado objetivo excede LATAM hispanohablante.
- Agregar SEO/Open Graph/canonical y estrategia de share cards.

### Baja prioridad

- Revisar radius y densidad visual para interfaces operativas. Hay mucho uso de cards y gradientes; para admin conviene una UI mas densa.
- Separar tokens del prototipo legacy y tokens reales de app si ambos se mantendran.
- Evaluar PWA/Web Push y auditoria Core Web Vitals antes de campanas grandes.

## Estrategia de monetizacion

Principio: monetizar competicion social, organizacion de grupos y experiencia premium, sin apuestas ni dinero real ligado al resultado deportivo.

Prerequisito P0.5: antes de implementar paywalls o checkout en frontend, definir el contrato backend de monetizacion. El alcance minimo deberia incluir:

- Planes y precios: `GET /billing/plans`.
- Checkout: `POST /billing/checkout`.
- Estado de suscripcion: `GET /billing/subscription`.
- Cancelacion/cambio de plan: `PATCH /billing/subscription`.
- Webhooks del proveedor de pagos.
- Cupones/promociones.
- Sponsors y placements.
- Vistas admin de revenue, conversion, refunds, churn y auditoria.

### Modelo 1: Freemium para jugadores

Gratis:

- Predicciones basicas para todos los partidos.
- Ranking global.
- Unirse a grupos.
- Crear 1 grupo privado.

Premium individual:

- Estadisticas avanzadas: precision por fase, historico por rival, rendimiento contra amigos.
- Recordatorios inteligentes antes de deadlines.
- Badges, avatar premium, temas visuales.
- Comparativas privadas: "contra tus amigos", "contra fans de tu seleccion".
- Exportar/share cards personalizadas.

Pantallas necesarias:

- Paywall suave en estadisticas avanzadas.
- Pagina `/premium`.
- Estado de plan en perfil.
- Admin de planes y cupones.

### Modelo 2: Grupos premium

Este parece el modelo mas natural para el producto.

Gratis:

- 1 grupo, limite de miembros, ranking basico.

Grupo Pro:

- Mas miembros.
- Branding del grupo.
- Ranking por jornadas.
- Estadisticas de participacion.
- Export CSV.
- Premios simbolicos configurables por el organizador.
- Invitaciones personalizadas.
- Modo empresa/oficina.

Por que encaja:

- Los grupos ya existen en `src/app/groups/page.tsx`.
- El codigo de invitacion ya es una mecanica viral en `src/app/groups/[id]/page.tsx:65` a `src/app/groups/[id]/page.tsx:80`.
- Las organizaciones y oficinas suelen pagar por experiencias cerradas y simples.

### Modelo 3: Patrocinios y espacios promocionados

Superficies recomendadas:

- Landing: patrocinador oficial de la quiniela.
- Dashboard: banner sobrio no intrusivo.
- Grupos: sponsor de liga/grupo.
- Ranking: premios patrocinados.
- Share cards: "presentado por".

Reglas:

- No poner ads en el momento exacto de prediccion si distraen.
- Separar patrocinio de scoring para evitar sesgos.
- Usar segmentacion por pais/equipo favorito con consentimiento.

### Modelo 4: B2B / white-label

Producto para empresas, comunidades, medios o creadores.

Oferta:

- Quiniela privada con branding.
- Panel de administrador.
- Usuarios ilimitados por plan.
- Reportes de participacion.
- Export de ranking.
- Soporte y setup.

Este modelo puede monetizar antes que el B2C, porque la app ya tiene admin, grupos y reglas configurables.

### Modelo 5: Afiliacion responsable

Si se explora afiliacion deportiva, mantener distancia de apuestas:

- Merchandising oficial.
- Camisetas, experiencias, contenido premium.
- Apps deportivas no relacionadas con apuestas.

Evitar:

- Casas de apuestas, odds o premios monetarios por acertar resultados, salvo revision legal estricta.

## Roadmap sugerido

### Fase 0 - Semana 1 a 2: confianza inmediata

- Corregir registro: enviar `country`.
- Implementar guardado real de perfil.
- Cambiar boton Google demo por "Cuenta demo" o OAuth real.
- Mostrar toasts/banners de error en mutaciones criticas, no solo `console.error`.
- Quitar temporalmente el tab "Por grupo" o conectarlo en el mismo sprint.
- Mejorar accesibilidad de modales, tabs, inputs y botones icon-only.
- Agregar pruebas E2E del flujo critico minimo.

Metricas:

- Registro completado.
- Perfil actualizado correctamente.
- Prediccion guardada correctamente.
- Errores de mutaciones visibles y medidos.

### Fase 0.5 - Paralelo: foundation de monetizacion

- Definir contrato API de planes, pagos, suscripciones, cupones y sponsors.
- Elegir proveedor de pagos segun pais objetivo.
- Definir implicaciones legales y fiscales.
- Definir eventos analytics de paywall, checkout y conversion.

### Fase 1 - 2 a 3 semanas: activacion y loop diario

- Agregar "Cierra pronto" en dashboard.
- Mostrar estado "Ya predicho" en tarjetas.
- Agregar eventos analytics basicos.
- Mejorar SEO/Open Graph de la landing.

Metricas:

- Primera prediccion creada.
- Porcentaje de usuarios con 3+ predicciones.
- Usuarios que crean o se unen a un grupo.

### Fase 2 - 4 a 6 semanas: loop social

- Prediccion inline.
- Share cards de prediccion y ranking.
- Invitacion de grupo con link compartible.
- Ranking por grupo funcional.
- Recordatorios de deadlines por email y evaluacion PWA/Web Push.
- Panel admin de crecimiento.
- Preparar i18n si el mercado objetivo incluye ingles/portugues.

Metricas:

- Invitaciones enviadas por usuario.
- Tasa de aceptacion de invitacion.
- Retencion D1/D7.
- Predicciones por usuario activo.

### Fase 3 - 6 a 10 semanas: monetizacion

- Plan Grupo Pro.
- Limites del plan gratis.
- Checkout y billing.
- Premium individual para estadisticas.
- Admin de planes, pagos, cupones y sponsors.

Metricas:

- Conversion a premium.
- Revenue por grupo.
- ARPU.
- Churn.
- Usuarios activos por grupo pagado.

## Instrumentacion recomendada

Eventos minimos:

- `signup_started`
- `signup_completed`
- `login_completed`
- `prediction_started`
- `prediction_saved`
- `prediction_edited`
- `match_deadline_seen`
- `group_created`
- `group_joined`
- `invite_copied`
- `leaderboard_viewed`
- `premium_paywall_seen`
- `checkout_started`
- `checkout_completed`

Propiedades utiles:

- `match_id`, `stage`, `group_name`, `deadline_hours_remaining`
- `prediction_source`: dashboard, matches, match_detail, reminder
- `user_country`, `favorite_team`
- `group_member_count`
- `plan`, `price`, `billing_period`

## Backlog priorizado

### P0

- Enviar `country` en registro y guardar perfil via API.
- Renombrar boton "Google" a "Cuenta demo" o implementar OAuth real.
- Mostrar feedback visible de errores en `submitPrediction`, `createGroup`, `joinGroup`, `updateAdminUserStatus` y `saveRules`.
- Ranking por grupo real o remover tab temporalmente.
- Accesibilidad minima: `aria-label` en icon-only buttons, `htmlFor/id` en inputs, roles basicos en tabs y modales.
- Mantener validacion DEV/CI con `typecheck`, `build` y `lint`.

### P0.5

- Definir contrato API de pagos, planes, suscripciones, cupones y sponsors.
- Decidir proveedor de pagos: Stripe, Mercado Pago, Wompi u otro segun pais objetivo.
- Definir estrategia legal/fiscal para pagos y patrocinadores.
- Agregar tests E2E del flujo critico: register/login, predict, create group, join group.

### P1

- Prediccion inline.
- Dashboard orientado a deadlines.
- Link de invitacion compartible.
- Eventos analytics.
- Panel admin de conversion y activacion.
- SEO/Open Graph/canonical y share cards.
- Evaluacion i18n para `es`, `en`, `pt-BR`.

### P2

- Premium individual.
- Grupo Pro.
- Sponsorship placements.
- Share cards visuales.
- Notificaciones por email/push.
- PWA/Web Push si las metricas de retorno diario lo justifican.
- Auditoria Core Web Vitals antes de adquisicion pagada.

### P3

- White-label B2B.
- Marketplace de grupos publicos.
- Temporadas futuras y torneos adicionales.

## Conclusion

La plataforma tiene una base prometedora y bastante completa para un MVP visual. Para que madure como producto, el foco debe pasar de "mostrar pantallas" a "cerrar ciclos": predecir mas rapido, competir con menos friccion, invitar amigos, medir conversion y habilitar pagos sobre los grupos. La monetizacion mas fuerte no deberia ser vender predicciones ni premios monetarios, sino vender organizacion, personalizacion, estadisticas, comunidad y patrocinios responsables.
