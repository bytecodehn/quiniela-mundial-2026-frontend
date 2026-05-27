"use client";

import { api } from "../api";
import { mockPredictions, mockStats } from "../fixtures";
import type { Prediction, PredictionStats, Pagination } from "@/types";
import { USE_MOCKS, mockDelay, useFetch } from "./useFetch";

export interface PredictionsResponse {
  predictions: Prediction[];
  stats: PredictionStats;
  pagination: Pagination;
}

export function usePredictions(params?: Record<string, string>) {
  const key = `predictions:${params ? JSON.stringify(params) : ""}`;
  return useFetch<PredictionsResponse>(async () => {
    if (USE_MOCKS) {
      await mockDelay();
      return {
        predictions: mockPredictions as Prediction[],
        stats: mockStats as PredictionStats,
        pagination: { page: 1, limit: 20, total: mockPredictions.length },
      };
    }
    return api.getPredictions(params);
  }, key);
}

export function useStats() {
  return useFetch<PredictionStats>(async () => {
    if (USE_MOCKS) {
      await mockDelay();
      return mockStats as PredictionStats;
    }
    return api.getStats();
  }, "stats");
}

export async function submitPrediction(input: {
  matchId: string;
  homeScore: number;
  awayScore: number;
}): Promise<{ prediction: Prediction }> {
  if (USE_MOCKS) {
    await mockDelay(200);
    return {
      prediction: {
        id: `mock-${Date.now()}`,
        match: {
          id: input.matchId,
          homeTeam: { id: "", name: "", code: "", flag: "", group: "A", rank: 0 },
          awayTeam: { id: "", name: "", code: "", flag: "", group: "A", rank: 0 },
          date: "",
          time: "",
          status: "upcoming",
          homeScore: null,
          awayScore: null,
        },
        predictedHomeScore: input.homeScore,
        predictedAwayScore: input.awayScore,
        points: null,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    };
  }
  return api.createPrediction(input);
}
