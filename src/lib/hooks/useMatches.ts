"use client";

import { api } from "../api";
import { allMatches, mockAdminMatches } from "../fixtures";
import type { Match, AdminMatch, Pagination } from "@/types";
import { USE_MOCKS, mockDelay, useFetch } from "./useFetch";

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

export function useMatches(params?: Record<string, string>) {
  const key = `matches:${params ? JSON.stringify(params) : ""}`;
  return useFetch<MatchesResponse>(async () => {
    if (USE_MOCKS) {
      await mockDelay();
      return { matches: allMatches as Match[], pagination: paginate(allMatches) };
    }
    return api.getMatches(params);
  }, key);
}

export function useMatch(id: string | undefined) {
  const key = `match:${id ?? ""}`;
  return useFetch<{ match: Match } | null>(async () => {
    if (!id) return null;
    if (USE_MOCKS) {
      await mockDelay();
      const found = allMatches.find((m) => m.id === id) as Match | undefined;
      return found ? { match: found } : null;
    }
    return api.getMatch(id);
  }, key);
}

export function useAdminMatches(params?: Record<string, string>) {
  const key = `admin-matches:${params ? JSON.stringify(params) : ""}`;
  return useFetch<AdminMatchesResponse>(async () => {
    if (USE_MOCKS) {
      await mockDelay();
      return { matches: mockAdminMatches as AdminMatch[], pagination: paginate(mockAdminMatches) };
    }
    return api.getAdminMatches(params);
  }, key);
}
