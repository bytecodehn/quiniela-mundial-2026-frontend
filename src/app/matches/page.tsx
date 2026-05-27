"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { FilterBar, Select, Tabs, MatchCard, EmptyState } from "@/components/ui";
import { allMatches } from "@/components/mock-data";
import type { MatchStage, GroupName } from "@/types";

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
  const [stageFilter, setStageFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("Todos");

  const filtered = allMatches.filter((m) => {
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

      {filtered.length === 0 ? (
        <EmptyState icon="⚽" text="No hay partidos que coincidan con los filtros seleccionados." />
      ) : (
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
