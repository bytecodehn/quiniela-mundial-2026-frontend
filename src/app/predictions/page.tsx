"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge, Card, EmptyState, ErrorState, FilterBar, Select, SkeletonRows, SkeletonStats } from "@/components/ui";
import { useMatches, usePredictions } from "@/lib/hooks";

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "exact", label: "Exactas" },
  { value: "correct", label: "Acertadas" },
  { value: "incorrect", label: "Fallidas" },
];

const stageOptions: { value: string; label: string }[] = [
  { value: "all", label: "Todas las fases" },
  { value: "group", label: "Fase de grupos" },
  { value: "round_of_16", label: "Octavos" },
  { value: "quarterfinal", label: "Cuartos" },
  { value: "semifinal", label: "Semifinal" },
  { value: "final", label: "Final" },
  { value: "third_place", label: "Tercer lugar" },
];

const statusConfig: Record<string, { label: string; variant: "gold" | "green" | "orange" | "red" | "muted" }> = {
  exact: { label: "Exacta", variant: "gold" },
  correct: { label: "Acertada", variant: "green" },
  pending: { label: "Pendiente", variant: "orange" },
  incorrect: { label: "Incorrecta", variant: "red" },
};

export default function PredictionsPage() {
  const { data, loading, error, refetch } = usePredictions();
  const { data: matchesData } = useMatches();
  const [statusFilter, setStatusFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const predictions = data?.predictions ?? [];
  const stats = data?.stats;
  const matches = matchesData?.matches ?? [];

  const filtered = predictions.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (stageFilter !== "all") {
      const match = matches.find((m) => m.id === p.match.id);
      if (!match || match.stage !== stageFilter) return false;
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-[1.8rem] font-bold font-display">Mis Predicciones</h1>
        <p className="text-fg-secondary mt-1">Historial de todos tus pronósticos</p>
      </div>

      {loading && <SkeletonStats count={3} />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-[0.75rem] text-fg-muted uppercase tracking-wider font-semibold mb-1">Exactas</div>
              <div className="text-[2rem] font-bold font-display text-gold">{stats.exactCount}</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-[0.75rem] text-fg-muted uppercase tracking-wider font-semibold mb-1">Acertadas</div>
              <div className="text-[2rem] font-bold font-display text-green">{stats.correctCount}</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-[0.75rem] text-fg-muted uppercase tracking-wider font-semibold mb-1">Pendientes</div>
              <div className="text-[2rem] font-bold font-display text-fg">{stats.predictionsPending}</div>
            </div>
          </Card>
        </div>
      )}

      <FilterBar>
        <Select options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        <Select options={stageOptions} value={stageFilter} onChange={setStageFilter} />
      </FilterBar>

      {loading && <SkeletonRows count={4} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon="🎯" text="No hay predicciones que coincidan con los filtros." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((prediction) => {
            const cfg = statusConfig[prediction.status];
            const isPending = prediction.status === "pending";
            return (
              <Card key={prediction.id} className="flex items-center gap-4 py-4 px-5">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-[1.5rem]">{prediction.match.homeTeam.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.95rem] font-semibold truncate">
                      {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
                    </div>
                    <div className="text-[0.75rem] text-fg-muted">
                      {prediction.match.date} · {prediction.match.time}
                    </div>
                  </div>
                  <span className="text-[1.5rem]">{prediction.match.awayTeam.flag}</span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.85rem] text-fg-secondary">
                      {prediction.predictedHomeScore}–{prediction.predictedAwayScore}
                    </span>
                    {!isPending && (
                      <span className="text-[0.85rem] text-fg-muted">
                        ({prediction.match.homeScore}–{prediction.match.awayScore})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    {prediction.points !== null && (
                      <span className="text-[0.8rem] font-semibold text-gold">{prediction.points} pts</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
