"use client";

import { AdminLayout } from "@/components/app-layout";
import { StatCard } from "@/components/ui";
import { mockAdminStats } from "@/components/mock-data";

export default function AdminDashboardPage() {
  const s = mockAdminStats;

  return (
    <AdminLayout>
      <h1 className="text-[1.6rem] font-bold font-display mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Total usuarios" value={s.totalUsers.toLocaleString("es-ES")} />
        </div>
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Usuarios activos" value={s.activeUsers.toLocaleString("es-ES")} />
        </div>
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Grupos" value={s.totalGroups.toLocaleString("es-ES")} />
        </div>
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Predicciones totales" value={s.totalPredictions.toLocaleString("es-ES")} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Partidos totales" value={s.totalMatches} />
        </div>
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Finalizados" value={s.matchesFinished} />
        </div>
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Próximos" value={s.matchesUpcoming} />
        </div>
        <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
          <StatCard label="Predicciones hoy" value={s.predictionsToday.toLocaleString("es-ES")} />
        </div>
      </div>
    </AdminLayout>
  );
}
