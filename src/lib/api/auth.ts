// Dominio: autenticación (F1 — integrado al backend real).
import type { User } from "@/types";
import { clearTokens, getRefresh, rawRequest, request, setTokens } from "./client";

export interface BackendUser {
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

// Traduce el DTO snake_case del backend al modelo del frontend. Las stats
// per-grupo (points/globalRank/predictionsCount) no viajan en el usuario;
// se completan vía leaderboard/stats del grupo activo (F4/F5).
export function mapUser(u: BackendUser): User {
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
    points: 0,
    globalRank: 0,
    predictionsCount: 0,
    createdAt: u.created_at ?? "",
  };
}

export const authApi = {
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
};
