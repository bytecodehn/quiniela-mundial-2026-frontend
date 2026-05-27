"use client";

import { api } from "../api";
import { mockGroupDetail } from "../fixtures";
import { mockStore } from "../fixtures/store";
import type { Group, GroupDetail } from "@/types";
import { USE_MOCKS, mockDelay, useFetch } from "./useFetch";

export function useGroups() {
  return useFetch<{ groups: Group[] }>(async () => {
    if (USE_MOCKS) {
      await mockDelay();
      return { groups: mockStore.listGroups() };
    }
    return api.getGroups();
  }, "groups");
}

export function useGroup(id: string | undefined) {
  const key = `group:${id ?? ""}`;
  return useFetch<{ group: GroupDetail } | null>(async () => {
    if (!id) return null;
    if (USE_MOCKS) {
      await mockDelay();
      return { group: mockGroupDetail as GroupDetail };
    }
    return api.getGroup(id);
  }, key);
}

export async function createGroup(input: { name: string }): Promise<{ group: Group }> {
  if (USE_MOCKS) {
    await mockDelay(200);
    const group: Group = {
      id: `mock-${Date.now()}`,
      name: input.name,
      inviteCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
      memberCount: 1,
      myRank: 1,
      myPoints: 0,
      createdBy: "Tú",
      createdAt: new Date().toISOString(),
    };
    mockStore.addGroup(group);
    return { group };
  }
  return api.createGroup(input);
}

export async function joinGroup(input: { inviteCode: string }): Promise<{ group: Group }> {
  if (USE_MOCKS) {
    await mockDelay(200);
    const group: Group = {
      id: `mock-${Date.now()}`,
      name: `Grupo ${input.inviteCode}`,
      inviteCode: input.inviteCode,
      memberCount: 1,
      myRank: null,
      myPoints: 0,
      createdBy: "—",
      createdAt: new Date().toISOString(),
    };
    mockStore.addGroup(group);
    return { group };
  }
  return api.joinGroup(input);
}
