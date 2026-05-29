// Dominio: predicciones. PENDIENTE F5: migrar a POST /predictions (upsert),
// GET /predictions/mine; derivar status/points en cliente; componer stats
// desde /groups/:id/my-score del grupo activo.
import type { Pagination, Prediction, PredictionStats } from "@/types";
import { request } from "./client";

export const predictionsApi = {
  getPredictions: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ predictions: Prediction[]; stats: PredictionStats; pagination: Pagination }>(`/predictions${qs}`);
  },

  createPrediction: (data: { matchId: string; homeScore: number; awayScore: number }) =>
    request<{ prediction: Prediction }>("/predictions", { method: "POST", body: JSON.stringify(data) }),

  getStats: () => request<PredictionStats>("/predictions/stats"),
};
