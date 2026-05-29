// Dominio: admin. PENDIENTE F6: /admin/stats, /admin/users (+ disabled/admin),
// matches -> /admin/tournament/*; reglas son per-grupo en el backend
// (reconvertir el editor de "reglas globales").
import type {
  AdminMatch,
  AdminStats,
  AdminUser,
  GroupName,
  Group,
  MatchStage,
  MatchStatus,
  Pagination,
  ScoringRule,
  UserStatus,
} from "@/types";
import { request } from "./client";

export const adminApi = {
  getAdminStats: () => request<AdminStats>("/admin/stats"),

  getAdminUsers: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ users: AdminUser[]; pagination: Pagination }>(`/admin/users${qs}`);
  },

  updateAdminUser: (id: string, data: { status: UserStatus }) =>
    request<{ user: AdminUser }>(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  getAdminMatches: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ matches: AdminMatch[]; pagination: Pagination }>(`/admin/matches${qs}`);
  },

  createAdminMatch: (data: {
    homeTeamId: string;
    awayTeamId: string;
    stage: MatchStage;
    groupName?: GroupName;
    stadium: string;
    date: string;
  }) => request<{ match: AdminMatch }>("/admin/matches", { method: "POST", body: JSON.stringify(data) }),

  updateAdminMatch: (id: string, data: { status?: MatchStatus; homeScore?: number; awayScore?: number }) =>
    request<{ match: AdminMatch }>(`/admin/matches/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  getRules: () => request<{ rules: ScoringRule[] }>("/admin/rules"),

  updateRules: (data: { rules: Pick<ScoringRule, "key" | "points" | "enabled">[] }) =>
    request<{ rules: ScoringRule[] }>("/admin/rules", { method: "PATCH", body: JSON.stringify(data) }),

  getAdminGroups: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ groups: Group[]; pagination: Pagination }>(`/admin/groups${qs}`);
  },
};
