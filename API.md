# API — Quiniela Mundial 2026

Backend contract for the frontend mockup. Base URL: `/api/v1`.

---

## 1. Autenticación

### `POST /auth/register`

Registro de usuario.

```
Request:
{
  "name": "Carlos Andrés",
  "email": "carlos@example.com",
  "password": "securePass123",
  "passwordConfirm": "securePass123",
  "favoriteTeam": "Argentina",       // opcional
  "country": "AR"                     // ISO alpha-2, opcional
}

Response 201:
{
  "user": {
    "id": "uuid",
    "name": "Carlos Andrés",
    "email": "carlos@example.com",
    "avatar": "initials",
    "favoriteTeam": "Argentina",
    "country": "AR",
    "createdAt": "2026-05-01T00:00:00Z"
  },
  "token": "jwt..."
}
```

### `POST /auth/login`

```
Request:
{
  "email": "carlos@example.com",
  "password": "securePass123"
}

Response 200:
{
  "user": { ... },
  "token": "jwt..."
}
```

### `POST /auth/forgot-password`

```
Request: { "email": "carlos@example.com" }
Response 200: { "message": "Si el correo existe, recibirás instrucciones." }
```

### `POST /auth/reset-password`

```
Request: { "token": "reset-token", "password": "newPass123", "passwordConfirm": "newPass123" }
Response 200: { "message": "Contraseña actualizada." }
```

### `GET /auth/me`

Headers: `Authorization: Bearer <token>`

```
Response 200: { "user": { ... } }
```

### `PATCH /auth/me`

```
Request:
{
  "name": "Carlos A.",
  "favoriteTeam": "Brasil",
  "country": "BR",
  "avatar": null               // o base64 / url
}

Response 200: { "user": { ... } }
```

---

## 2. Partidos

### `GET /matches`

Query params:
- `stage` — `group`, `round_of_16`, `quarterfinal`, `semifinal`, `final`
- `groupId` — filtrar por grupo mundialista (A–H)
- `dateFrom` / `dateTo` — ISO date
- `status` — `upcoming`, `live`, `finished`
- `page` / `limit`

```
Response 200:
{
  "matches": [
    {
      "id": "uuid",
      "homeTeam": { "id": "uuid", "name": "Argentina", "flag": "🇦🇷", "code": "ARG" },
      "awayTeam": { "id": "uuid", "name": "Brasil", "flag": "🇧🇷", "code": "BRA" },
      "stage": "group",
      "groupName": "A",
      "stadium": "Estadio Monumental, Buenos Aires",
      "date": "2026-06-14",
      "time": "16:00",
      "status": "upcoming",           // upcoming | live | finished
      "homeScore": null,               // null si no ha empezado
      "awayScore": null,
      "isPredictionOpen": true,
      "predictionDeadline": "2026-06-14T16:00:00Z",
      "userPrediction": null           // si el usuario ya predijo: { homeScore, awayScore, status }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 64 }
}
```

### `GET /matches/:id`

```
Response 200: { "match": { ... detalles completos ... } }
```

### `POST /matches` (admin)

```
Request:
{
  "homeTeamId": "uuid",
  "awayTeamId": "uuid",
  "stage": "group",
  "groupName": "A",
  "stadium": "Estadio...",
  "date": "2026-06-14T16:00:00Z"
}
```

### `PATCH /matches/:id` (admin)

Para actualizar estado o resultado:

```
Request:
{
  "status": "finished",
  "homeScore": 2,
  "awayScore": 1
}
```

---

## 3. Predicciones

### `GET /predictions`

Query params:
- `status` — `pending`, `correct`, `incorrect`, `exact`
- `stage` — group, round_of_16, ...
- `dateFrom` / `dateTo`
- `page` / `limit`

```
Response 200:
{
  "predictions": [
    {
      "id": "uuid",
      "match": {
        "id": "uuid",
        "homeTeam": { "name": "Argentina", "flag": "🇦🇷", "code": "ARG" },
        "awayTeam": { "name": "Brasil", "flag": "🇧🇷", "code": "BRA" },
        "date": "2026-06-14",
        "time": "16:00",
        "status": "finished",
        "homeScore": 2,
        "awayScore": 1
      },
      "predictedHomeScore": 2,
      "predictedAwayScore": 1,
      "points": 5,
      "status": "exact",           // pending | correct | incorrect | exact
      "createdAt": "2026-05-20T10:00:00Z"
    }
  ],
  "stats": {
    "total": 38,
    "exact": 12,
    "correct": 18,
    "pending": 8
  },
  "pagination": { ... }
}
```

### `POST /predictions`

```
Request:
{
  "matchId": "uuid",
  "homeScore": 2,
  "awayScore": 1
}

Response 201:
{
  "prediction": {
    "id": "uuid",
    "matchId": "uuid",
    "homeScore": 2,
    "awayScore": 1,
    "status": "pending",
    "createdAt": "..."
  },
  "pointsAwarded": null       // null hasta que termine el partido
}
```

### `PATCH /predictions/:id`

Solo si el partido sigue abierto (`isPredictionOpen: true`).

```
Request: { "homeScore": 3, "awayScore": 0 }
Response 200: { "prediction": { ... } }
```

### `GET /predictions/stats`

Resumen del dashboard.

```
Response 200:
{
  "totalPoints": 284,
  "globalRank": 1,
  "groupRank": 1,
  "groupId": "uuid",
  "groupName": "Los Crack del 26",
  "predictionsPending": 8,
  "lastResults": [
    {
      "match": { ... },
      "prediction": { ... },
      "points": 5
    }
  ]
}
```

---

## 4. Ranking / Leaderboard

### `GET /leaderboard/global`

```
Response 200:
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "MessiFan_10",
      "avatar": "MG",
      "points": 284,
      "correctPredictions": 42,
      "exactPredictions": 14,
      "totalPredictions": 56
    }
  ],
  "currentUser": {
    "rank": 1,
    "userId": "uuid",
    "name": "Carlos Andrés",
    "avatar": "CA",
    "points": 284,
    "correctPredictions": 42,
    "exactPredictions": 14,
    "totalPredictions": 56
  },
  "pagination": { ... }
}
```

### `GET /leaderboard/group/:groupId`

Misma estructura que global, pero filtrada al grupo.

---

## 5. Grupos privados

### `GET /groups`

```
Response 200:
{
  "groups": [
    {
      "id": "uuid",
      "name": "Los Crack del 26",
      "inviteCode": "CRACK26",
      "memberCount": 12,
      "myRank": 1,
      "myPoints": 284,
      "createdAt": "2026-05-01T00:00:00Z"
    }
  ]
}
```

### `POST /groups`

```
Request: { "name": "Los Crack del 26" }
Response 201: { "group": { ..., "inviteCode": "AUTOGENERATED" } }
```

### `POST /groups/join`

```
Request: { "inviteCode": "CRACK26" }
Response 200: { "group": { ... } }
```

### `GET /groups/:id`

```
Response 200:
{
  "group": {
    "id": "uuid",
    "name": "Los Crack del 26",
    "inviteCode": "CRACK26",
    "memberCount": 12,
    "createdAt": "...",
    "members": [
      {
        "userId": "uuid",
        "name": "Carlos Andrés",
        "avatar": "CA",
        "points": 284,
        "rank": 1,
        "joinedAt": "..."
      }
    ]
  }
}
```

### `DELETE /groups/:id/members/:userId` (admin / creator)

---

## 6. Admin — Dashboard

### `GET /admin/stats`

```
Response 200:
{
  "totalUsers": 50240,
  "activeUsers": 38400,
  "totalGroups": 8240,
  "totalMatches": 64,
  "totalPredictions": 891200,
  "matchesFinished": 48,
  "matchesUpcoming": 16,
  "predictionsToday": 3400
}
```

### `GET /admin/users`

Query params: `search`, `status` (`active`, `blocked`), `page`, `limit`

```
Response 200:
{
  "users": [
    {
      "id": "uuid",
      "name": "Carlos Andrés",
      "email": "carlos@example.com",
      "country": "AR",
      "status": "active",
      "points": 284,
      "predictionsCount": 38,
      "groupsCount": 3,
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

### `PATCH /admin/users/:id`

```
Request: { "status": "blocked" }
Response 200: { "user": { ... } }
```

### `GET /admin/matches`

Query params + response same as `GET /matches` but includes editing capabilities.

### `POST /admin/matches`

Same as `POST /matches`.

### `PATCH /admin/matches/:id`

Same as `PATCH /matches/:id`.

### `GET /admin/rules`

```
Response 200:
{
  "rules": [
    { "key": "exact_score", "label": "Marcador exacto", "points": 5, "enabled": true },
    { "key": "correct_winner", "label": "Acertar ganador o empate", "points": 3, "enabled": true },
    { "key": "incorrect", "label": "Fallar", "points": 0, "enabled": true },
    { "key": "correct_goal_diff", "label": "Acertar diferencia de goles", "points": 4, "enabled": false },
    { "key": "knockout_bonus", "label": "Bonus fase eliminatoria", "points": 2, "enabled": true }
  ]
}
```

### `PATCH /admin/rules`

```
Request:
{
  "rules": [
    { "key": "exact_score", "points": 5, "enabled": true },
    ...
  ]
}
Response 200: { "rules": [ ... ] }
```

### `GET /admin/groups`

```
Response 200:
{
  "groups": [
    {
      "id": "uuid",
      "name": "Los Crack del 26",
      "memberCount": 12,
      "createdBy": "Carlos Andrés",
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

## 7. Equipos / Selecciones

### `GET /teams`

```
Response 200:
{
  "teams": [
    {
      "id": "uuid",
      "name": "Argentina",
      "code": "ARG",
      "flag": "🇦🇷",
      "group": "A",
      "rank": 1
    }
  ]
}
```

---

## 8. Scoring rules (frontend debe conocerlas)

| Condición | Puntos | Ejemplo |
|---|---|---|
| Marcador exacto | 5 | Predijiste 2-1 y fue 2-1 |
| Acertar ganador o empate | 3 | Predijiste 2-0 y fue 1-0 |
| Fallar | 0 | Predijiste 2-0 y fue 0-2 |
| Bonus fase eliminatoria | +2 | Sobre los puntos anteriores en KO stages |

---

## 9. Modelos de datos (resumen)

### User
```
id, name, email, passwordHash, avatar, favoriteTeam, country,
status (active|blocked), role (user|admin), createdAt, updatedAt
```

### Team
```
id, name, code (FIFA 3-letter), flag, group (A–H), rank (FIFA), createdAt
```

### Match
```
id, homeTeamId, awayTeamId, stage, groupName, stadium,
date (datetime), status (upcoming|live|finished),
homeScore (nullable), awayScore (nullable), createdAt
```

### Prediction
```
id, userId, matchId, homeScore, awayScore,
status (pending|correct|incorrect|exact),
points (nullable), createdAt, updatedAt
```

### Group
```
id, name, inviteCode (unique), createdBy (userId), createdAt
```

### GroupMember
```
id, groupId, userId, joinedAt
```

### ScoringRule
```
id, key (unique), label, points (int), enabled (bool), updatedAt
```

---

## 10. Notas para el equipo frontend

- Todas las rutas autenticadas usan `Authorization: Bearer <jwt>`.
- El JWT debe expirar en 7 días. Incluir `userId`, `role`.
- Los códigos de invitación de grupo deben ser únicos, generados aleatoriamente (8 caracteres alfanuméricos).
- El scoring se calcula del lado del servidor cuando un partido pasa a `finished`.
- `predictionDeadline` = `match.date` (no se puede predecir después del inicio).
- Las banderas pueden servirse como emoji o imagen URL. El frontend espera emoji en la respuesta.
- Paginación: siempre devolver `{ page, limit, total }`.
