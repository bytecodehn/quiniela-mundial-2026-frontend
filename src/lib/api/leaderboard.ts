// Dominio: leaderboard (F4 — integrado al backend real).
//
// El backend es PER-GRUPO: NO existe un ranking global. Los datos salen de:
//   GET /groups/:id/leaderboard?limit=N  → tabla del grupo
//   GET /groups/:id/my-score             → posición del usuario actual
// Se mapean los DTO snake_case del backend Go al modelo camelCase del frontend.
//
// Limitación del contrato: el leaderboard del backend NO expone correct/exact
// por usuario, solo total_points / matches_scored / bonus_points. Por eso
// correctPredictions y exactPredictions quedan en 0, y totalPredictions se
// mapea desde matches_scored (cantidad de partidos puntuados para ese usuario).
import type { LeaderboardEntry, LeaderboardResponse } from "@/types";
import { request } from "./client";

// DTO del backend (contrato F4).
interface GroupLeaderboardEntry {
  rank: number;
  user_id: string;
  email: string;
  total_points: number;
  matches_scored: number;
  bonus_points: number;
}

interface GroupLeaderboardResponse {
  group_id: string;
  version: number;
  updated_at: string;
  total: number;
  entries: GroupLeaderboardEntry[];
}

interface MyScoreResponse {
  group_id: string;
  user_id: string;
  version: number;
  rank: number;
  total_points: number;
  matches_scored: number;
  bonus_points: number;
}

function avatarFromEmail(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

function mapEntry(e: GroupLeaderboardEntry): LeaderboardEntry {
  return {
    rank: e.rank,
    userId: e.user_id,
    name: e.email,
    avatar: avatarFromEmail(e.email),
    points: e.total_points,
    // El backend no expone correct/exact por usuario en el leaderboard.
    correctPredictions: 0,
    exactPredictions: 0,
    totalPredictions: e.matches_scored,
  };
}

function mapMyScore(s: MyScoreResponse): LeaderboardEntry {
  return {
    rank: s.rank,
    userId: s.user_id,
    name: "",
    avatar: "",
    points: s.total_points,
    correctPredictions: 0,
    exactPredictions: 0,
    totalPredictions: s.matches_scored,
  };
}

export const leaderboardApi = {
  // NO existe ranking global en el backend (es per-grupo). La página, en modo
  // real, usa el grupo activo y nunca llama acá; queda como guardia explícita.
  getGlobalLeaderboard: (): Promise<LeaderboardResponse> => {
    throw new Error("El ranking global no está disponible; usá el leaderboard por grupo");
  },

  getGroupLeaderboard: async (groupId: string): Promise<LeaderboardResponse> => {
    const [board, mine] = await Promise.all([
      request<GroupLeaderboardResponse>(`/groups/${groupId}/leaderboard`),
      request<MyScoreResponse>(`/groups/${groupId}/my-score`),
    ]);

    const leaderboard = board.entries.map(mapEntry);
    return {
      leaderboard,
      currentUser: mapMyScore(mine),
      pagination: { page: 1, limit: leaderboard.length, total: board.total },
    };
  },
};
