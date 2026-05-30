// Dominio: admin. Integrado al backend Go real (F6).
//
// Adaptaciones notables (el backend no expone los endpoints que asumía el
// mockup original, así que los wrappers se mantienen pero el mapeo cambia):
//
//  - Stats: GET /admin/stats devuelve un objeto anidado; se aplana a AdminStats.
//  - Users: GET /admin/users + PATCH /admin/users/:id/disabled (no hay un PATCH
//    genérico /admin/users/:id). El backend no expone puntos/predicciones/grupos
//    por usuario en este endpoint, así que esos campos van en 0.
//  - Matches: NO existe /admin/matches. Para listar se usa GET /tournament/matches
//    (array de Match del torneo). Crear -> POST /admin/tournament/matches.
//    Actualizar marcador/estado -> PATCH /admin/tournament/matches/:id/score.
//  - Rules: NO hay /admin/rules global. Las reglas son POR GRUPO en el backend.
//    getRules deriva una vista read-only del primer preset de GET /scoring/presets.
//    updateRules rechaza con un Error claro (no hay endpoint global de escritura).
//  - Groups: GET /admin/groups devuelve array de GroupResponse (snake_case).

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
  Team,
  UserStatus,
} from "@/types";
import { flagForFifaCode } from "@/lib/flags";
import { request } from "./client";

// ---------------------------------------------------------------------------
// Shapes del backend (snake_case). Solo los campos que consumimos.
// ---------------------------------------------------------------------------

interface BackendStats {
  users: { total: number; admins: number; disabled: number };
  groups: { total: number; rules_locked: number };
  predictions: { total: number; locked: number };
  matches: { total: number; scored: number; completed: number };
  bonuses: { total: number; revoked: number; streak: number; perfect_matchday: number };
  scoring_runs_24h: { succeeded: number; failed: number; skipped: number };
}

interface BackendUser {
  id: string;
  email: string;
  created_at: string;
  last_login_at?: string;
  is_admin: boolean;
  disabled_at?: string;
}

interface BackendUsersResponse {
  total: number;
  users: BackendUser[];
}

interface BackendTeam {
  id: number;
  fifa_code: string;
  name_en: string;
  name_es: string;
  flag_emoji?: string;
  fifa_rank?: number;
}

interface BackendScore {
  home?: number;
  away?: number;
}

interface BackendMatch {
  id: number;
  stage: string; // "group" | "r32" | "r16" | "qf" | "sf" | "third" | "final"
  group?: string;
  kickoff_utc: string;
  venue?: string;
  venue_city?: string;
  status: string; // "scheduled" | "live" | "completed" | ...
  home?: BackendTeam;
  away?: BackendTeam;
  home_placeholder?: string;
  away_placeholder?: string;
  score?: BackendScore;
}

interface BackendGroup {
  id: string;
  name: string;
  owner_user_id: string;
  member_count: number;
  created_at: string;
}

interface BackendPreset {
  points_exact_score: number;
  points_correct_winner: number;
  points_correct_draw: number;
  points_goal_diff_only: number;
  bonus_underdog: number;
  allow_draw_in_knockout?: boolean;
  name?: string;
  key?: string;
}

// ---------------------------------------------------------------------------
// Helpers de mapeo backend -> tipos frontend.
// ---------------------------------------------------------------------------

const VALID_GROUPS: GroupName[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

function toGroupName(g?: string | null): GroupName {
  if (g && (VALID_GROUPS as string[]).includes(g)) return g as GroupName;
  return "A";
}

function mapStage(stage: string): MatchStage {
  switch (stage) {
    case "r32":
      return "round_of_32";
    case "r16":
      return "round_of_16";
    case "qf":
      return "quarterfinal";
    case "sf":
      return "semifinal";
    case "third":
      return "third_place";
    case "final":
      return "final";
    case "group":
    default:
      return "group";
  }
}

// Inverso de mapStage, para enviar al backend al crear partidos.
function unmapStage(stage: MatchStage): string {
  switch (stage) {
    case "round_of_32":
      return "r32";
    case "round_of_16":
      return "r16";
    case "quarterfinal":
      return "qf";
    case "semifinal":
      return "sf";
    case "third_place":
      return "third";
    case "final":
      return "final";
    case "group":
    default:
      return "group";
  }
}

function mapMatchStatus(status: string): MatchStatus {
  switch (status) {
    case "live":
      return "live";
    case "completed":
      return "finished";
    case "scheduled":
    default:
      return "upcoming";
  }
}

// Inverso de mapMatchStatus, para enviar al backend.
function unmapMatchStatus(status: MatchStatus): string {
  switch (status) {
    case "live":
      return "live";
    case "finished":
      return "completed";
    case "upcoming":
    default:
      return "scheduled";
  }
}

function mapTeam(team: BackendTeam | undefined, placeholder: string | undefined, group: GroupName): Team {
  if (!team) {
    return {
      id: "",
      name: placeholder ?? "Por definir",
      code: "",
      flag: "",
      group,
      rank: 0,
    };
  }
  return {
    id: String(team.id),
    name: team.name_es || team.name_en,
    code: team.fifa_code,
    flag: team.flag_emoji || flagForFifaCode(team.fifa_code),
    group,
    rank: team.fifa_rank ?? 0,
  };
}

function mapMatchToAdmin(m: BackendMatch): AdminMatch {
  const stage = mapStage(m.stage);
  const group = toGroupName(m.group);
  const dt = new Date(m.kickoff_utc);
  const validDate = !Number.isNaN(dt.getTime());
  // ISO -> "YYYY-MM-DD" / "HH:MM" sin depender del locale.
  const iso = validDate ? dt.toISOString() : "";
  const date = validDate ? iso.slice(0, 10) : m.kickoff_utc;
  const time = validDate ? iso.slice(11, 16) : "";

  return {
    id: String(m.id),
    homeTeam: mapTeam(m.home, m.home_placeholder, group),
    awayTeam: mapTeam(m.away, m.away_placeholder, group),
    stage,
    groupName: stage === "group" ? group : null,
    stadium: m.venue ?? m.venue_city ?? "",
    date,
    time,
    status: mapMatchStatus(m.status),
    homeScore: m.score && typeof m.score.home === "number" ? m.score.home : null,
    awayScore: m.score && typeof m.score.away === "number" ? m.score.away : null,
  };
}

function mapUserToAdmin(u: BackendUser): AdminUser {
  return {
    id: u.id,
    name: u.email.split("@")[0],
    email: u.email,
    country: "",
    status: u.disabled_at ? "blocked" : "active",
    points: 0,
    predictionsCount: 0,
    groupsCount: 0,
    createdAt: u.created_at,
  };
}

function mapGroup(g: BackendGroup): Group {
  return {
    id: g.id,
    name: g.name,
    inviteCode: "",
    memberCount: g.member_count,
    myRank: null,
    myPoints: null,
    createdBy: g.owner_user_id,
    createdAt: g.created_at,
  };
}

function presetToRules(preset: BackendPreset): ScoringRule[] {
  return [
    { key: "exact_score", label: "Marcador exacto", points: preset.points_exact_score, enabled: true },
    { key: "correct_winner", label: "Acertar ganador", points: preset.points_correct_winner, enabled: true },
    {
      key: "goal_diff",
      label: "Diferencia de goles",
      points: preset.points_goal_diff_only,
      enabled: preset.points_goal_diff_only > 0,
    },
    {
      key: "bonus_underdog",
      label: "Bonus underdog",
      points: preset.bonus_underdog,
      enabled: preset.bonus_underdog > 0,
    },
  ];
}

function syntheticPagination(total: number): Pagination {
  return { page: 1, limit: total, total };
}

// ---------------------------------------------------------------------------
// API pública del dominio admin. Mismas firmas que el mockup original.
// ---------------------------------------------------------------------------

export const adminApi = {
  getAdminStats: async (): Promise<AdminStats> => {
    const s = await request<BackendStats>("/admin/stats");
    return {
      totalUsers: s.users.total,
      activeUsers: s.users.total - s.users.disabled,
      totalGroups: s.groups.total,
      totalMatches: s.matches.total,
      totalPredictions: s.predictions.total,
      matchesFinished: s.matches.completed,
      matchesUpcoming: Math.max(0, s.matches.total - s.matches.completed),
      predictionsToday: 0,
    };
  },

  getAdminUsers: async (
    params?: Record<string, string>,
  ): Promise<{ users: AdminUser[]; pagination: Pagination }> => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await request<BackendUsersResponse>(`/admin/users${qs}`);
    const users = res.users.map(mapUserToAdmin);
    return { users, pagination: { page: 1, limit: users.length, total: res.total } };
  },

  // El backend no tiene un PATCH genérico de usuario: para (des)bloquear se usa
  // PATCH /admin/users/:id/disabled. Reconstruimos un AdminUser mínimo con el
  // status nuevo (el listado trae el resto de campos para la UI).
  updateAdminUser: async (id: string, data: { status: UserStatus }): Promise<{ user: AdminUser }> => {
    const disabled = data.status === "blocked";
    await request<{ ok: true }>(`/admin/users/${id}/disabled`, {
      method: "PATCH",
      body: JSON.stringify({ disabled }),
    });
    const user: AdminUser = {
      id,
      name: "",
      email: "",
      country: "",
      status: data.status,
      points: 0,
      predictionsCount: 0,
      groupsCount: 0,
      createdAt: "",
    };
    return { user };
  },

  // No existe /admin/matches. Listamos desde el torneo y mapeamos a AdminMatch.
  getAdminMatches: async (
    _params?: Record<string, string>,
  ): Promise<{ matches: AdminMatch[]; pagination: Pagination }> => {
    const raw = await request<BackendMatch[]>("/tournament/matches");
    const matches = raw.map(mapMatchToAdmin);
    return { matches, pagination: syntheticPagination(matches.length) };
  },

  createAdminMatch: async (data: {
    homeTeamId: string;
    awayTeamId: string;
    stage: MatchStage;
    groupName?: GroupName;
    stadium: string;
    date: string;
  }): Promise<{ match: AdminMatch }> => {
    // El backend acepta stage, group_label, kickoff_utc, home_fifa_code,
    // away_fifa_code, venue. El form de la UI envía nombres/ids libres; mandamos
    // lo que se puede mapear con seguridad.
    const body: Record<string, unknown> = {
      stage: unmapStage(data.stage),
      kickoff_utc: data.date,
    };
    if (data.groupName) body.group_label = data.groupName;
    if (data.stadium) body.venue = data.stadium;
    if (data.homeTeamId) body.home_fifa_code = data.homeTeamId;
    if (data.awayTeamId) body.away_fifa_code = data.awayTeamId;
    const created = await request<BackendMatch>("/admin/tournament/matches", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { match: mapMatchToAdmin(created) };
  },

  updateAdminMatch: async (
    id: string,
    data: { status?: MatchStatus; homeScore?: number; awayScore?: number },
  ): Promise<{ match: AdminMatch }> => {
    const body: Record<string, unknown> = {};
    if (data.status) body.status = unmapMatchStatus(data.status);
    if (typeof data.homeScore === "number") body.home_score = data.homeScore;
    if (typeof data.awayScore === "number") body.away_score = data.awayScore;
    const updated = await request<BackendMatch>(`/admin/tournament/matches/${id}/score`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return { match: mapMatchToAdmin(updated) };
  },

  // No hay /admin/rules global. Derivamos una vista read-only del preset global.
  getRules: async (): Promise<{ rules: ScoringRule[] }> => {
    const presets = await request<BackendPreset[]>("/scoring/presets");
    const preset =
      presets.find((p) => p.key === "classic" || p.name === "classic") ?? presets[0];
    if (!preset) return { rules: [] };
    return { rules: presetToRules(preset) };
  },

  // Las reglas se configuran POR GRUPO en el backend; no hay endpoint global de
  // escritura. Rechazamos con un mensaje claro para la UI.
  updateRules: async (
    _data: { rules: Pick<ScoringRule, "key" | "points" | "enabled">[] },
  ): Promise<{ rules: ScoringRule[] }> => {
    throw new Error("Las reglas se configuran por grupo, no globalmente.");
  },

  getAdminGroups: async (
    _params?: Record<string, string>,
  ): Promise<{ groups: Group[]; pagination: Pagination }> => {
    const raw = await request<BackendGroup[]>("/admin/groups");
    const groups = raw.map(mapGroup);
    return { groups, pagination: syntheticPagination(groups.length) };
  },
};
