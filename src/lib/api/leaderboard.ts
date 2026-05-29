// Dominio: leaderboard. PENDIENTE F4: el backend es per-grupo
// (/groups/:id/leaderboard, /groups/:id/my-score); NO hay ranking global.
import type { LeaderboardResponse } from "@/types";
import { request } from "./client";

export const leaderboardApi = {
  getGlobalLeaderboard: () => request<LeaderboardResponse>("/leaderboard/global"),

  getGroupLeaderboard: (groupId: string) =>
    request<LeaderboardResponse>(`/leaderboard/group/${groupId}`),
};
