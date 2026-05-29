"use client";

import { api } from "../api";
import { allMatches, mockAdminMatches } from "../fixtures";
import { mockStore } from "../fixtures/store";
import type { Match, AdminMatch, Pagination } from "@/types";
import { USE_MOCKS_ADMIN, USE_MOCKS_TOURNAMENT, mockDelay, useFetch } from "./useFetch";

export interface MatchesResponse {
  matches: Match[];
  pagination: Pagination;
}

export interface AdminMatchesResponse {
  matches: AdminMatch[];
  pagination: Pagination;
}

function paginate<T>(items: T[]): Pagination {
  return { page: 1, limit: 20, total: items.length };
}

/**
 * Aplica las predicciones del mockStore como `userPrediction` sobre los
 * matches base. Lo necesitamos porque allMatches viene de fixtures (no
 * cambia entre sesiones), pero el usuario sí muta predicciones via
 * submitPrediction.
 */
function overlayPredictions(matches: Match[]): Match[] {
  const predictions = mockStore.listPredictions();
  if (predictions.length === 0) return matches;
  return matches.map((m) => {
    const pred = predictions.find((p) => p.match.id === m.id);
    if (!pred) return m;
    return {
      ...m,
      userPrediction: {
        homeScore: pred.predictedHomeScore,
        awayScore: pred.predictedAwayScore,
        status: pred.status,
      },
    };
  });
}

export function useMatches(params?: Record<string, string>) {
  const key = `matches:${params ? JSON.stringify(params) : ""}`;
  return useFetch<MatchesResponse>(async () => {
    if (USE_MOCKS_TOURNAMENT) {
      await mockDelay();
      const matches = overlayPredictions(allMatches as Match[]);
      return { matches, pagination: paginate(matches) };
    }
    return api.getMatches(params);
  }, key);
}

export function useMatch(id: string | undefined) {
  const key = `match:${id ?? ""}`;
  return useFetch<{ match: Match } | null>(async () => {
    if (!id) return null;
    if (USE_MOCKS_TOURNAMENT) {
      await mockDelay();
      const found = (allMatches as Match[]).find((m) => m.id === id);
      if (!found) return null;
      const [overlaid] = overlayPredictions([found]);
      return { match: overlaid };
    }
    return api.getMatch(id);
  }, key);
}

export function useAdminMatches(params?: Record<string, string>) {
  const key = `admin-matches:${params ? JSON.stringify(params) : ""}`;
  return useFetch<AdminMatchesResponse>(async () => {
    if (USE_MOCKS_ADMIN) {
      await mockDelay();
      return { matches: mockAdminMatches as AdminMatch[], pagination: paginate(mockAdminMatches) };
    }
    return api.getAdminMatches(params);
  }, key);
}
