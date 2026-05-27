"use client";

import { AdminLayout } from "@/components/app-layout";
import { ErrorState, SkeletonStats, StatCard } from "@/components/ui";
import { useAdminStats } from "@/lib/hooks";

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useAdminStats();

  return (
    <AdminLayout>
      <h1 className="text-[1.6rem] font-bold font-display mb-8">Dashboard</h1>

      {loading && (
        <>
          <SkeletonStats count={4} />
          <div className="mt-6">
            <SkeletonStats count={4} />
          </div>
        </>
      )}

      {!loading && (error || !data) && (
        <ErrorState message={error ?? "No se pudieron cargar las estadísticas."} onRetry={refetch} />
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Total usuarios" value={data.totalUsers.toLocaleString("es-ES")} />
            </div>
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Usuarios activos" value={data.activeUsers.toLocaleString("es-ES")} />
            </div>
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Grupos" value={data.totalGroups.toLocaleString("es-ES")} />
            </div>
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Predicciones totales" value={data.totalPredictions.toLocaleString("es-ES")} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Partidos totales" value={data.totalMatches} />
            </div>
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Finalizados" value={data.matchesFinished} />
            </div>
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Próximos" value={data.matchesUpcoming} />
            </div>
            <div className="bg-bg-surface border border-border rounded-radius-lg p-6">
              <StatCard label="Predicciones hoy" value={data.predictionsToday.toLocaleString("es-ES")} />
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
