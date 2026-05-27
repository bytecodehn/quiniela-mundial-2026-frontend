"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Badge, Button, Card, CardTitle, ErrorState, SkeletonStats, StatCard } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useMatches, useStats } from "@/lib/hooks";

const quickActions = [
  { href: "/matches", label: "Calendario de Partidos", desc: "Explora todos los partidos y haz tus predicciones", icon: "⚽" },
  { href: "/leaderboard", label: "Ranking Global", desc: "Compara tus puntos con otros jugadores", icon: "🏆" },
  { href: "/groups", label: "Mis Grupos", desc: "Compite con amigos en grupos privados", icon: "👥" },
  { href: "/predictions", label: "Mis Predicciones", desc: "Revisa el historial de tus pronósticos", icon: "🎯" },
];

const SOON_THRESHOLD_MS = 24 * 3600 * 1000;

function CountdownLabel({ deadline }: { deadline: string }) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  const remaining = new Date(deadline).getTime() - now;
  if (remaining <= 0) {
    return <span className="text-red text-[0.75rem] font-semibold">Cerrado</span>;
  }
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const text = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const soon = remaining < SOON_THRESHOLD_MS;
  return (
    <span
      className={`text-[0.75rem] font-semibold tabular-nums ${soon ? "text-orange" : "text-fg-muted"}`}
      aria-label={`Tiempo restante para predecir: ${text}`}
    >
      ⏱ {text}
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useStats();
  const { data: matchesData, loading: matchesLoading } = useMatches();

  const upcoming = (matchesData?.matches ?? [])
    .filter((m) => m.status === "upcoming" && m.isPredictionOpen)
    .slice()
    .sort(
      (a, b) =>
        new Date(a.predictionDeadline).getTime() - new Date(b.predictionDeadline).getTime(),
    )
    .slice(0, 4);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-[1.8rem] font-bold font-display">
          ¡Bienvenido, {user?.name?.split(" ")[0] || "Jugador"}!
        </h1>
        <p className="text-fg-secondary mt-1">Esto es lo que está pasando en tu quiniela</p>
      </div>

      {statsLoading && <SkeletonStats count={4} />}
      {!statsLoading && statsError && (
        <div className="mb-10">
          <ErrorState message={statsError} onRetry={refetchStats} />
        </div>
      )}
      {!statsLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card>
            <StatCard label="Puntos totales" value={stats.totalPoints} change="+12 esta semana" changeUp />
          </Card>
          <Card>
            <StatCard label="Ranking global" value={`#${stats.globalRank}`} changeUp change="Subiste 2 posiciones" />
          </Card>
          <Card>
            <StatCard label="Ranking grupo" value={stats.groupRank !== null ? `#${stats.groupRank}` : "—"} changeUp={false} change={stats.groupName || "—"} />
          </Card>
          <Card>
            <StatCard label="Predicciones pendientes" value={stats.predictionsPending} />
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardTitle>Próximos por cerrar</CardTitle>
          <div className="mt-4 space-y-3">
            {matchesLoading && <p className="text-fg-muted text-[0.9rem]">Cargando...</p>}
            {!matchesLoading && upcoming.length === 0 && (
              <p className="text-fg-muted text-[0.9rem]">No hay partidos próximos abiertos</p>
            )}
            {upcoming.map((match) => {
              const remaining = new Date(match.predictionDeadline).getTime() - Date.now();
              const soon = remaining > 0 && remaining < SOON_THRESHOLD_MS;
              return (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="flex items-center gap-3 px-4 py-3 bg-bg-primary rounded-radius-md hover:bg-bg-elevated transition-colors no-underline"
                >
                  <span className="text-[1.3rem]">{match.homeTeam.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.9rem] text-fg font-medium truncate">
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CountdownLabel deadline={match.predictionDeadline} />
                      {soon && <Badge variant="orange">Cierra pronto</Badge>}
                    </div>
                  </div>
                  {match.userPrediction ? (
                    <span className="text-[0.85rem] text-fg-secondary font-mono tabular-nums">
                      {match.userPrediction.homeScore}–{match.userPrediction.awayScore}
                    </span>
                  ) : (
                    <Button size="sm">Predecir</Button>
                  )}
                </Link>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardTitle>Últimos resultados</CardTitle>
          <div className="mt-4 space-y-3">
            {statsLoading && <p className="text-fg-muted text-[0.9rem]">Cargando...</p>}
            {!statsLoading && stats && stats.lastResults.length === 0 && (
              <p className="text-fg-muted text-[0.9rem]">Sin resultados aún</p>
            )}
            {!statsLoading &&
              stats?.lastResults.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 bg-bg-primary rounded-radius-md"
                >
                  <span className="text-[1.3rem]">{r.match.homeTeam.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.9rem] font-medium truncate">
                      {r.match.homeTeam.name} vs {r.match.awayTeam.name}
                    </div>
                    <div className="text-[0.75rem] text-fg-muted">
                      {r.prediction.status === "exact" ? "¡Exacta!" : "Acertada"} · {r.points} pts
                    </div>
                  </div>
                  <span className="font-display font-bold text-[1.1rem]">
                    {r.match.homeScore}–{r.match.awayScore}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <h2 className="text-[1.3rem] font-bold mb-4">Acceso rápido</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-bg-surface border border-border rounded-radius-lg p-5 hover:bg-bg-elevated hover:border-fg-secondary transition-all duration-150 no-underline"
          >
            <div className="text-[2rem] mb-3">{action.icon}</div>
            <h3 className="text-[1rem] font-semibold text-fg mb-1">{action.label}</h3>
            <p className="text-[0.8rem] text-fg-muted">{action.desc}</p>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
