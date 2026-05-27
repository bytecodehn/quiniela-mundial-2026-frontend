"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { EmptyState, ErrorState, FilterBar, MatchCard, Select, SkeletonRows, Tabs } from "@/components/ui";
import { useMatches } from "@/lib/hooks";
import type { GroupName } from "@/types";

const stageOptions: { value: string; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "group", label: "Fase de grupos" },
  { value: "round_of_16", label: "Octavos" },
  { value: "quarterfinal", label: "Cuartos" },
  { value: "semifinal", label: "Semifinal" },
  { value: "final", label: "Final" },
  { value: "third_place", label: "Tercer lugar" },
];

const groupOptions: { value: string; label: string }[] = [
  { value: "all", label: "Todos los grupos" },
  ...(["A", "B", "C", "D", "E", "F", "G", "H"] as GroupName[]).map((g) => ({ value: g, label: `Grupo ${g}` })),
];

const statusTabs = ["Todos", "Próximos", "Finalizados"];

export default function MatchesPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useMatches();
  const [stageFilter, setStageFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("Todos");

  const matches = data?.matches ?? [];
  const filtered = matches.filter((m) => {
    if (stageFilter !== "all" && m.stage !== stageFilter) return false;
    if (groupFilter !== "all" && m.groupName !== groupFilter) return false;
    if (statusTab === "Próximos" && m.status !== "upcoming") return false;
    if (statusTab === "Finalizados" && m.status !== "finished") return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-[1.8rem] font-bold font-display">Calendario de Partidos</h1>
        <p className="text-fg-secondary mt-1">Mundial 2026 — Todos los partidos del torneo</p>
      </div>

      <FilterBar>
        <Select options={stageOptions} value={stageFilter} onChange={setStageFilter} />
        <Select options={groupOptions} value={groupFilter} onChange={setGroupFilter} />
      </FilterBar>

      <Tabs tabs={statusTabs} active={statusTab} onChange={setStatusTab} />

      {loading && <SkeletonRows count={6} />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon="⚽" text="No hay partidos que coincidan con los filtros seleccionados." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              variant="dark"
              onPredict={() => router.push(`/matches/${match.id}`)}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
