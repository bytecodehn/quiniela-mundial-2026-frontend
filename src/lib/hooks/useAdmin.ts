"use client";

import { api } from "../api";
import {
  mockAdminGroups,
  mockAdminStats,
  mockAdminUsers,
} from "../fixtures";
import { mockStore } from "../fixtures/store";
import type {
  AdminStats,
  AdminUser,
  Group,
  Pagination,
  ScoringRule,
  UserStatus,
  AdminMatch,
  MatchStatus,
  MatchStage,
  GroupName,
} from "@/types";
import { USE_MOCKS_ADMIN, mockDelay, useFetch } from "./useFetch";

function paginate<T>(items: T[]): Pagination {
  return { page: 1, limit: 20, total: items.length };
}

export function useAdminStats() {
  return useFetch<AdminStats>(async () => {
    if (USE_MOCKS_ADMIN) {
      await mockDelay();
      return mockAdminStats as AdminStats;
    }
    return api.getAdminStats();
  }, "admin:stats");
}

export function useAdminUsers(params?: Record<string, string>) {
  const key = `admin:users:${params ? JSON.stringify(params) : ""}`;
  return useFetch<{ users: AdminUser[]; pagination: Pagination }>(async () => {
    if (USE_MOCKS_ADMIN) {
      await mockDelay();
      return { users: mockAdminUsers as AdminUser[], pagination: paginate(mockAdminUsers) };
    }
    return api.getAdminUsers(params);
  }, key);
}

export async function updateAdminUserStatus(id: string, status: UserStatus): Promise<{ user: AdminUser }> {
  if (USE_MOCKS_ADMIN) {
    await mockDelay(150);
    const found = mockAdminUsers.find((u) => u.id === id) as AdminUser | undefined;
    if (!found) throw new Error("Usuario no encontrado");
    return { user: { ...found, status } };
  }
  return api.updateAdminUser(id, { status });
}

export function useAdminGroups(params?: Record<string, string>) {
  const key = `admin:groups:${params ? JSON.stringify(params) : ""}`;
  return useFetch<{ groups: Group[]; pagination: Pagination }>(async () => {
    if (USE_MOCKS_ADMIN) {
      await mockDelay();
      return { groups: mockAdminGroups as Group[], pagination: paginate(mockAdminGroups) };
    }
    return api.getAdminGroups(params);
  }, key);
}

export function useRules() {
  return useFetch<{ rules: ScoringRule[] }>(async () => {
    if (USE_MOCKS_ADMIN) {
      await mockDelay();
      return { rules: mockStore.listRules() };
    }
    return api.getRules();
  }, "admin:rules");
}

export async function saveRules(rules: Pick<ScoringRule, "key" | "points" | "enabled">[]): Promise<{ rules: ScoringRule[] }> {
  if (USE_MOCKS_ADMIN) {
    await mockDelay(200);
    const current = mockStore.listRules();
    const merged: ScoringRule[] = rules.map((r) => {
      const existing = current.find((c) => c.key === r.key);
      return { ...r, label: existing?.label ?? r.key };
    });
    mockStore.setRules(merged);
    return { rules: merged };
  }
  return api.updateRules({ rules });
}

export async function createAdminMatch(input: {
  homeTeamId: string;
  awayTeamId: string;
  stage: MatchStage;
  groupName?: GroupName;
  stadium: string;
  date: string;
}): Promise<{ match: AdminMatch }> {
  if (USE_MOCKS_ADMIN) {
    await mockDelay(200);
    throw new Error("createAdminMatch no soportado en modo mock");
  }
  return api.createAdminMatch(input);
}

export async function updateAdminMatchScore(
  id: string,
  input: { status?: MatchStatus; homeScore?: number; awayScore?: number },
): Promise<{ match: AdminMatch }> {
  if (USE_MOCKS_ADMIN) {
    await mockDelay(150);
    throw new Error("updateAdminMatch no soportado en modo mock");
  }
  return api.updateAdminMatch(id, input);
}
