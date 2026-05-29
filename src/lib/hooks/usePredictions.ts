"use client";

import { api } from "../api";
import { mockStats } from "../fixtures";
import { mockStore } from "../fixtures/store";
import type { Prediction, PredictionStats, Pagination } from "@/types";
import { USE_MOCKS_PREDICTIONS, mockDelay, useFetch } from "./useFetch";

export interface PredictionsResponse {
  predictions: Prediction[];
  stats: PredictionStats;
  pagination: Pagination;
}

export function usePredictions(params?: Record<string, string>) {
  const key = `predictions:${params ? JSON.stringify(params) : ""}`;
  return useFetch<PredictionsResponse>(async () => {
    if (USE_MOCKS_PREDICTIONS) {
      await mockDelay();
      const predictions = mockStore.listPredictions();
      return {
        predictions,
        stats: mockStats as PredictionStats,
        pagination: { page: 1, limit: 20, total: predictions.length },
      };
    }
    return api.getPredictions(params);
  }, key);
}

// Lee el id del grupo activo. NOTA: las páginas que consumen useStats
// (dashboard, profile) RENDERIZAN AppLayout ellas mismas, así que sus hooks
// corren POR ENCIMA del ActiveGroupProvider (que vive dentro de AppLayout) y
// useActiveGroup() lanzaría "must be used within ActiveGroupProvider". Por eso
// leemos directamente el localStorage que el provider persiste (misma fuente de
// verdad, key `qm26-active-group`); es SSR-safe (null en server) y no depende
// del scope del provider. No editamos active-group.tsx.
function readActiveGroupId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("qm26-active-group");
}

export function useStats() {
  // Las stats per-grupo (puntos/rank) se leen respecto al grupo activo.
  const activeGroupId = readActiveGroupId();
  return useFetch<PredictionStats>(async () => {
    if (USE_MOCKS_PREDICTIONS) {
      await mockDelay();
      return mockStats as PredictionStats;
    }
    return api.getStats(activeGroupId ?? undefined);
  }, `stats:${activeGroupId ?? ""}`);
}

export async function submitPrediction(input: {
  matchId: string;
  homeScore: number;
  awayScore: number;
  match?: Prediction["match"];
}): Promise<{ prediction: Prediction }> {
  if (USE_MOCKS_PREDICTIONS) {
    await mockDelay(200);
    const prediction: Prediction = {
      id: `mock-${Date.now()}`,
      match: input.match ?? {
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
    };
    mockStore.addPrediction(prediction);
    return { prediction };
  }
  return api.createPrediction(input);
}
