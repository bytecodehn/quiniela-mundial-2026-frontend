// Dominio: tournament (equipos y partidos). PENDIENTE F2: migrar a
// /tournament/* del backend (snake->camel, status, placeholders, kickoff_utc).
import type { Match, Pagination, Team } from "@/types";
import { request } from "./client";

export const tournamentApi = {
  getMatches: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ matches: Match[]; pagination: Pagination }>(`/matches${qs}`);
  },

  getMatch: (id: string) => request<{ match: Match }>(`/matches/${id}`),

  getTeams: () => request<{ teams: Team[] }>("/teams"),
};
