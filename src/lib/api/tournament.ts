// Dominio: tournament (equipos y partidos). Integrado al backend Go real
// (F2): consume /tournament/* y mapea el contrato snake_case del backend a
// los tipos camelCase del frontend. Las respuestas del backend son JSON crudo
// (arrays/objetos sin envoltorio), así que este módulo sintetiza los wrappers
// `{teams}` / `{matches, pagination}` / `{match}` que esperan los hooks.
import type { GroupName, Match, MatchStage, MatchStatus, Pagination, Team } from "@/types";
import { flagForFifaCode } from "@/lib/flags";
import { request } from "./client";

// --- Contrato del backend (snake_case, tal cual lo emite Go) ---

interface BackendTeam {
  id: number;
  fifa_code: string;
  name_en: string;
  name_es: string;
  confederation: string;
  flag_emoji?: string;
  fifa_rank?: number;
}

type BackendStage = "group" | "r32" | "r16" | "qf" | "sf" | "third" | "final";
type BackendStatus = "scheduled" | "live" | "completed" | "postponed" | "cancelled";

interface BackendScore {
  home: number | null;
  away: number | null;
  home_et?: number | null;
  away_et?: number | null;
  home_pens?: number | null;
  away_pens?: number | null;
}

interface BackendMatch {
  id: number;
  stage: BackendStage;
  group?: string;
  matchday?: number;
  kickoff_utc: string;
  venue?: string;
  venue_city?: string;
  status: BackendStatus;
  home?: BackendTeam;
  away?: BackendTeam;
  home_placeholder?: string;
  away_placeholder?: string;
  score?: BackendScore;
}

// --- Mapeo backend -> frontend ---

const STAGE_MAP: Record<BackendStage, MatchStage> = {
  group: "group",
  r32: "round_of_32",
  r16: "round_of_16",
  qf: "quarterfinal",
  sf: "semifinal",
  third: "third_place",
  final: "final",
};

const STATUS_MAP: Record<BackendStatus, MatchStatus> = {
  scheduled: "upcoming",
  live: "live",
  completed: "finished",
  postponed: "upcoming",
  cancelled: "upcoming",
};

// El endpoint de teams no trae grupo: cae a "A". En el contexto de un match
// se pasa el label del grupo del match (que sí lo trae) como `group`.
function mapTeam(team: BackendTeam, group: GroupName = "A"): Team {
  return {
    id: String(team.id),
    name: team.name_es || team.name_en,
    code: team.fifa_code,
    flag: team.flag_emoji || flagForFifaCode(team.fifa_code),
    group,
    rank: team.fifa_rank ?? 0,
  };
}

// Equipo placeholder para knockouts sin resolver (home/away null).
function placeholderTeam(label?: string): Team {
  return {
    id: "",
    name: label ?? "Por definir",
    code: "",
    flag: "",
    group: "A",
    rank: 0,
  };
}

function mapMatch(match: BackendMatch): Match {
  const groupName: GroupName | null = (match.group as GroupName) ?? null;
  const teamGroup: GroupName = groupName ?? "A";

  const homeTeam = match.home ? mapTeam(match.home, teamGroup) : placeholderTeam(match.home_placeholder);
  const awayTeam = match.away ? mapTeam(match.away, teamGroup) : placeholderTeam(match.away_placeholder);

  const kickoff = match.kickoff_utc;

  return {
    id: String(match.id),
    homeTeam,
    awayTeam,
    stage: STAGE_MAP[match.stage] ?? "group",
    groupName,
    stadium: match.venue ?? match.venue_city ?? "",
    date: kickoff.slice(0, 10),
    time: kickoff.slice(11, 16),
    status: STATUS_MAP[match.status] ?? "upcoming",
    homeScore: match.score?.home ?? null,
    awayScore: match.score?.away ?? null,
    isPredictionOpen: match.status === "scheduled" && new Date(kickoff).getTime() > Date.now(),
    predictionDeadline: kickoff,
    // El overlay de predicciones del usuario lo agrega el módulo predictions.
    userPrediction: null,
  };
}

// --- API pública del dominio ---

export const tournamentApi = {
  getMatches: async (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const raw = await request<BackendMatch[]>(`/tournament/matches${qs}`);
    const matches = raw.map(mapMatch);
    const pagination: Pagination = { page: 1, limit: matches.length, total: matches.length };
    return { matches, pagination };
  },

  getMatch: async (id: string) => {
    const raw = await request<BackendMatch>(`/tournament/matches/${id}`);
    return { match: mapMatch(raw) };
  },

  getTeams: async () => {
    const raw = await request<BackendTeam[]>("/tournament/teams");
    return { teams: raw.map((t) => mapTeam(t)) };
  },
};
