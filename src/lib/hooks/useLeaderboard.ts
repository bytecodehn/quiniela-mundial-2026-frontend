"use client";

import { api } from "../api";
import { mockLeaderboard, mockUser } from "../fixtures";
import type { LeaderboardEntry, LeaderboardResponse } from "@/types";
import { USE_MOCKS, mockDelay, useFetch } from "./useFetch";

function mockResponse(): LeaderboardResponse {
  const top = mockLeaderboard[0];
  const currentUser: LeaderboardEntry = {
    rank: mockUser.globalRank,
    userId: mockUser.id,
    name: mockUser.name,
    avatar: mockUser.avatar,
    points: mockUser.points,
    correctPredictions: top?.correctPredictions ?? 0,
    exactPredictions: top?.exactPredictions ?? 0,
    totalPredictions: top?.totalPredictions ?? 0,
  };
  return {
    leaderboard: mockLeaderboard as LeaderboardEntry[],
    currentUser,
    pagination: { page: 1, limit: 50, total: mockLeaderboard.length },
  };
}

export function useGlobalLeaderboard() {
  return useFetch<LeaderboardResponse>(async () => {
    if (USE_MOCKS) {
      await mockDelay();
      return mockResponse();
    }
    return api.getGlobalLeaderboard();
  }, "leaderboard:global");
}

export function useGroupLeaderboard(groupId: string | undefined) {
  const key = `leaderboard:group:${groupId ?? ""}`;
  return useFetch<LeaderboardResponse | null>(async () => {
    if (!groupId) return null;
    if (USE_MOCKS) {
      await mockDelay();
      return mockResponse();
    }
    return api.getGroupLeaderboard(groupId);
  }, key);
}
