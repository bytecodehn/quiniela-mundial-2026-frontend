const BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  /* Auth */
  register: (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    favoriteTeam?: string;
    country?: string;
  }) => request<{ user: import("@/types").User; token: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ user: import("@/types").User; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  forgotPassword: (data: { email: string }) =>
    request<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),

  me: () => request<{ user: import("@/types").User }>("/auth/me"),

  updateMe: (data: Partial<{ name: string; favoriteTeam: string; country: string; avatar: string | null }>) =>
    request<{ user: import("@/types").User }>("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),

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
