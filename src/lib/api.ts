// Base URL del backend Go (montado en la raíz, sin prefijo /api/v1).
// Se configura por entorno: NEXT_PUBLIC_API_URL=http://192.168.244.128:8888 (dev server).
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

// El access token se guarda bajo "token" (compat con auth.tsx, que lo lee
// directo como check de sesión). El refresh token va aparte.
const ACCESS_KEY = "token";
const REFRESH_KEY = "refresh_token";

function getAccess(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null;
}
function getRefresh(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null;
}
export function setTokens(access: string, refresh?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function rawRequest(path: string, options?: RequestInit, withAuth = true): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) ?? {}),
  };
  if (withAuth) {
    const token = getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${BASE}${path}`, { ...options, headers });
}

// Un único refresh en vuelo a la vez: si varios requests dan 401 en paralelo,
// comparten la misma promesa de refresh en lugar de dispararlo N veces.
let refreshInflight: Promise<boolean> | null = null;
async function tryRefresh(): Promise<boolean> {
  const rt = getRefresh();
  if (!rt) return false;
  if (!refreshInflight) {
    refreshInflight = (async () => {
      try {
        const res = await rawRequest(
          "/auth/refresh",
          { method: "POST", body: JSON.stringify({ refresh_token: rt }) },
          false,
        );
        if (!res.ok) {
          clearTokens();
          return false;
        }
        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);
        return true;
      } catch {
        return false;
      } finally {
        refreshInflight = null;
      }
    })();
  }
  return refreshInflight;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res = await rawRequest(path, options);

  // Access token vencido (15 min): intenta refresh una vez y reintenta.
  if (res.status === 401 && getRefresh()) {
    const ok = await tryRefresh();
    if (ok) res = await rawRequest(path, options);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---- Mapeo de DTOs del backend (snake_case) al modelo del frontend ----

interface BackendUser {
  id: string;
  email: string;
  is_admin?: boolean;
  name?: string | null;
  avatar?: string | null;
  country?: string | null;
  favorite_team?: string | null;
  created_at?: string;
}

interface BackendAuthResult {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapUser(u: BackendUser): import("@/types").User {
  const name = u.name ?? "";
  return {
    id: u.id,
    name,
    email: u.email,
    avatar: u.avatar ?? (name ? initials(name) : ""),
    favoriteTeam: u.favorite_team ?? "",
    country: u.country ?? "",
    status: "active",
    role: u.is_admin ? "admin" : "user",
    // Stats per-grupo: el modelo del backend no las trae en el usuario;
    // se completan vía leaderboard/stats del grupo activo (F4/F5).
    points: 0,
    globalRank: 0,
    predictionsCount: 0,
    createdAt: u.created_at ?? "",
  };
}

export const api = {
  /* Auth */
  register: async (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    favoriteTeam?: string;
    country?: string;
  }) => {
    const res = await request<BackendAuthResult>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name || undefined,
        country: data.country || undefined,
        favorite_team: data.favoriteTeam || undefined,
      }),
    });
    setTokens(res.access_token, res.refresh_token);
    return { user: mapUser(res.user), token: res.access_token };
  },

  login: async (data: { email: string; password: string }) => {
    const res = await request<BackendAuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setTokens(res.access_token, res.refresh_token);
    return { user: mapUser(res.user), token: res.access_token };
  },

  logout: async () => {
    const rt = getRefresh();
    if (rt) {
      // Revoca el refresh token en el backend (rotación absoluta). No bloquea
      // el logout local si falla.
      try {
        await rawRequest("/auth/logout", { method: "POST", body: JSON.stringify({ refresh_token: rt }) }, false);
      } catch {
        /* ignore */
      }
    }
    clearTokens();
  },

  forgotPassword: (data: { email: string }) =>
    request<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),

  me: async () => {
    const res = await request<{ user: BackendUser }>("/auth/me");
    return { user: mapUser(res.user) };
  },

  updateMe: async (data: Partial<{ name: string; favoriteTeam: string; country: string; avatar: string | null }>) => {
    const body: Record<string, unknown> = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.avatar !== undefined) body.avatar = data.avatar;
    if (data.country !== undefined) body.country = data.country;
    if (data.favoriteTeam !== undefined) body.favorite_team = data.favoriteTeam;
    const res = await request<{ user: BackendUser }>("/auth/me", { method: "PATCH", body: JSON.stringify(body) });
    return { user: mapUser(res.user) };
  },

  /* Matches */
  getMatches: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ matches: import("@/types").Match[]; pagination: import("@/types").Pagination }>(`/matches${qs}`);
  },

  getMatch: (id: string) => request<{ match: import("@/types").Match }>(`/matches/${id}`),

  /* Predictions */
  getPredictions: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ predictions: import("@/types").Prediction[]; stats: import("@/types").PredictionStats; pagination: import("@/types").Pagination }>(`/predictions${qs}`);
  },

  createPrediction: (data: { matchId: string; homeScore: number; awayScore: number }) =>
    request<{ prediction: import("@/types").Prediction }>("/predictions", { method: "POST", body: JSON.stringify(data) }),

  getStats: () => request<import("@/types").PredictionStats>("/predictions/stats"),

  /* Leaderboard */
  getGlobalLeaderboard: () =>
    request<import("@/types").LeaderboardResponse>("/leaderboard/global"),

  getGroupLeaderboard: (groupId: string) =>
    request<import("@/types").LeaderboardResponse>(`/leaderboard/group/${groupId}`),

  /* Groups */
  getGroups: () => request<{ groups: import("@/types").Group[] }>("/groups"),

  getGroup: (id: string) => request<{ group: import("@/types").GroupDetail }>(`/groups/${id}`),

  createGroup: (data: { name: string }) =>
    request<{ group: import("@/types").Group }>("/groups", { method: "POST", body: JSON.stringify(data) }),

  joinGroup: (data: { inviteCode: string }) =>
    request<{ group: import("@/types").Group }>("/groups/join", { method: "POST", body: JSON.stringify(data) }),

  /* Teams */
  getTeams: () => request<{ teams: import("@/types").Team[] }>("/teams"),

  /* Admin */
  getAdminStats: () => request<import("@/types").AdminStats>("/admin/stats"),

  getAdminUsers: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ users: import("@/types").AdminUser[]; pagination: import("@/types").Pagination }>(`/admin/users${qs}`);
  },

  updateAdminUser: (id: string, data: { status: import("@/types").UserStatus }) =>
    request<{ user: import("@/types").AdminUser }>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  getAdminMatches: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ matches: import("@/types").AdminMatch[]; pagination: import("@/types").Pagination }>(`/admin/matches${qs}`);
  },

  createAdminMatch: (data: {
    homeTeamId: string;
    awayTeamId: string;
    stage: import("@/types").MatchStage;
    groupName?: import("@/types").GroupName;
    stadium: string;
    date: string;
  }) => request<{ match: import("@/types").AdminMatch }>("/admin/matches", { method: "POST", body: JSON.stringify(data) }),

  updateAdminMatch: (id: string, data: { status?: import("@/types").MatchStatus; homeScore?: number; awayScore?: number }) =>
    request<{ match: import("@/types").AdminMatch }>(`/admin/matches/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  getRules: () => request<{ rules: import("@/types").ScoringRule[] }>("/admin/rules"),

  updateRules: (data: { rules: Pick<import("@/types").ScoringRule, "key" | "points" | "enabled">[] }) =>
    request<{ rules: import("@/types").ScoringRule[] }>("/admin/rules", { method: "PATCH", body: JSON.stringify(data) }),

  getAdminGroups: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ groups: import("@/types").Group[]; pagination: import("@/types").Pagination }>(`/admin/groups${qs}`);
  },
};
