"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/app-layout";
import { Badge, Button, Card, ErrorState, FilterBar, Flag, Input, Modal, Select, SkeletonRows } from "@/components/ui";
import { useAdminMatches } from "@/lib/hooks";
import type { AdminMatch, GroupName, MatchStage, MatchStatus } from "@/types";

const stageLabels: Record<MatchStage, string> = {
  group: "Grupos",
  round_of_32: "Dieciseisavos",
  round_of_16: "Octavos",
  quarterfinal: "Cuartos",
  semifinal: "Semifinal",
  final: "Final",
  third_place: "3er puesto",
};

export default function AdminMatchesPage() {
  const { data, loading, error, refetch } = useAdminMatches();
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminMatch | null>(null);

  const [form, setForm] = useState({ homeTeam: "", awayTeam: "", stage: "group" as MatchStage, groupName: "A", stadium: "", date: "" });
  const [editForm, setEditForm] = useState({ homeScore: "", awayScore: "", status: "upcoming" as MatchStatus });

  useEffect(() => {
    if (data) setMatches(data.matches);
  }, [data]);

  const filtered = filter === "all" ? matches : matches.filter((m) => m.status === filter);

  function handleCreate() {
    const newMatch: AdminMatch = {
      id: `m-admin-${Date.now()}`,
      homeTeam: { id: `t-new`, name: form.homeTeam, code: form.homeTeam.slice(0, 3).toUpperCase(), flag: "", group: form.groupName as GroupName, rank: 0 },
      awayTeam: { id: `t-new2`, name: form.awayTeam, code: form.awayTeam.slice(0, 3).toUpperCase(), flag: "", group: form.groupName as GroupName, rank: 0 },
      stage: form.stage,
      groupName: form.stage === "group" ? (form.groupName as GroupName) : null,
      stadium: form.stadium,
      date: form.date,
      time: "20:00",
      status: "upcoming",
      homeScore: null,
      awayScore: null,
    };
    setMatches([newMatch, ...matches]);
    setCreateOpen(false);
    setForm({ homeTeam: "", awayTeam: "", stage: "group", groupName: "A", stadium: "", date: "" });
  }

  function handleEdit() {
    if (!editTarget) return;
    setMatches(
      matches.map((m) =>
        m.id === editTarget.id
          ? {
              ...m,
              homeScore: editForm.homeScore !== "" ? Number(editForm.homeScore) : null,
              awayScore: editForm.awayScore !== "" ? Number(editForm.awayScore) : null,
              status: editForm.status,
            }
          : m,
      ),
    );
    setEditTarget(null);
    setEditForm({ homeScore: "", awayScore: "", status: "upcoming" });
  }

  function openEdit(m: AdminMatch) {
    setEditTarget(m);
    setEditForm({
      homeScore: m.homeScore !== null ? String(m.homeScore) : "",
      awayScore: m.awayScore !== null ? String(m.awayScore) : "",
      status: m.status,
    });
  }

  function statusBadge(status: MatchStatus) {
    const map: Record<MatchStatus, { variant: "green" | "orange" | "blue"; label: string }> = {
      finished: { variant: "green", label: "Finalizado" },
      live: { variant: "orange", label: "En vivo" },
      upcoming: { variant: "blue", label: "Próximo" },
    };
    const v = map[status];
    return <Badge variant={v.variant}>{v.label}</Badge>;
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-[1.6rem] font-bold font-display">Partidos</h1>
        <Button onClick={() => setCreateOpen(true)} disabled={loading}>Crear partido</Button>
      </div>

      <FilterBar>
        <Select
          options={[
            { value: "all", label: "Todos" },
            { value: "upcoming", label: "Próximos" },
            { value: "finished", label: "Finalizados" },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </FilterBar>

      {loading && <SkeletonRows count={6} />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-border text-fg-muted text-[0.75rem] uppercase tracking-wider">
                <th className="p-4 font-semibold">Equipo local</th>
                <th className="p-4 font-semibold">Resultado</th>
                <th className="p-4 font-semibold">Equipo visitante</th>
                <th className="p-4 font-semibold">Fase</th>
                <th className="p-4 font-semibold">Grupo</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-b-0 hover:bg-bg-primary/40 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <Flag code={m.homeTeam.code} name={m.homeTeam.name} className="mr-2 h-4 w-auto" />
                    {m.homeTeam.name}
                  </td>
                  <td className="p-4 whitespace-nowrap font-mono font-bold text-[1rem]">
                    {m.homeScore !== null ? `${m.homeScore} – ${m.awayScore}` : "–"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <Flag code={m.awayTeam.code} name={m.awayTeam.name} className="mr-2 h-4 w-auto" />
                    {m.awayTeam.name}
                  </td>
                  <td className="p-4 whitespace-nowrap">{stageLabels[m.stage]}</td>
                  <td className="p-4 whitespace-nowrap">{m.groupName ?? "–"}</td>
                  <td className="p-4 whitespace-nowrap">{m.date}</td>
                  <td className="p-4 whitespace-nowrap">{statusBadge(m.status)}</td>
                  <td className="p-4 whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(m)}>
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Crear partido">
        <Input label="Equipo local" value={form.homeTeam} onChange={(e) => setForm({ ...form, homeTeam: e.target.value })} />
        <Input label="Equipo visitante" value={form.awayTeam} onChange={(e) => setForm({ ...form, awayTeam: e.target.value })} />
        <Select
          options={[
            { value: "group", label: "Grupos" },
            { value: "round_of_16", label: "Octavos" },
            { value: "quarterfinal", label: "Cuartos" },
            { value: "semifinal", label: "Semifinal" },
            { value: "final", label: "Final" },
            { value: "third_place", label: "3er puesto" },
          ]}
          value={form.stage}
          onChange={(v) => setForm({ ...form, stage: v as MatchStage })}
        />
        <div className="mb-5">
          <label className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">Grupo</label>
          <Select
            options={["A", "B", "C", "D", "E", "F", "G", "H"].map((g) => ({ value: g, label: `Grupo ${g}` }))}
            value={form.groupName}
            onChange={(v) => setForm({ ...form, groupName: v })}
          />
        </div>
        <Input label="Estadio" value={form.stadium} onChange={(e) => setForm({ ...form, stadium: e.target.value })} />
        <Input label="Fecha" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate}>Crear</Button>
        </div>
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar partido">
        <Input label="Goles local" type="number" value={editForm.homeScore} onChange={(e) => setEditForm({ ...editForm, homeScore: e.target.value })} />
        <Input label="Goles visitante" type="number" value={editForm.awayScore} onChange={(e) => setEditForm({ ...editForm, awayScore: e.target.value })} />
        <div className="mb-5">
          <label className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">Estado</label>
          <Select
            options={[
              { value: "upcoming", label: "Próximo" },
              { value: "live", label: "En vivo" },
              { value: "finished", label: "Finalizado" },
            ]}
            value={editForm.status}
            onChange={(v) => setEditForm({ ...editForm, status: v as MatchStatus })}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setEditTarget(null)}>Cancelar</Button>
          <Button onClick={handleEdit}>Guardar</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
