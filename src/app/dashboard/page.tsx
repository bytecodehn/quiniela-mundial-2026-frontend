"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Card, CardTitle, StatCard, Button } from "@/components/ui";
import { mockMatches, mockFinishedMatches, mockStats } from "@/components/mock-data";
import { useAuth } from "@/lib/auth";

const quickActions = [
  { href: "/matches", label: "Calendario de Partidos", desc: "Explora todos los partidos y haz tus predicciones", icon: "⚽" },
  { href: "/leaderboard", label: "Ranking Global", desc: "Compara tus puntos con otros jugadores", icon: "🏆" },
  { href: "/groups", label: "Mis Grupos", desc: "Compite con amigos en grupos privados", icon: "👥" },
  { href: "/predictions", label: "Mis Predicciones", desc: "Revisa el historial de tus pronósticos", icon: "🎯" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const upcoming = mockMatches.filter((m) => m.status === "upcoming").slice(0, 4);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-[1.8rem] font-bold font-display">
          ¡Bienvenido, {user?.name?.split(" ")[0] || "Jugador"}!
        </h1>
        <p className="text-fg-secondary mt-1">Esto es lo que está pasando en tu quiniela</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card>
          <StatCard label="Puntos totales" value={mockStats.totalPoints} change="+12 esta semana" changeUp />
        </Card>
        <Card>
          <StatCard label="Ranking global" value={`#${mockStats.globalRank}`} changeUp change="Subiste 2 posiciones" />
        </Card>
        <Card>
          <StatCard label="Ranking grupo" value={`#${mockStats.groupRank}`} changeUp={false} change={mockStats.groupName || "-"} />
        </Card>
        <Card>
          <StatCard label="Predicciones pendientes" value={mockStats.predictionsPending} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardTitle>Próximos partidos</CardTitle>
          <div className="mt-4 space-y-3">
            {upcoming.length === 0 && <p className="text-fg-muted text-[0.9rem]">No hay partidos próximos</p>}
            {upcoming.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="flex items-center gap-3 px-4 py-3 bg-bg-primary rounded-radius-md hover:bg-bg-elevated transition-colors no-underline"
              >
                <span className="text-[1.3rem]">{match.homeTeam.flag}</span>
                <span className="flex-1 text-[0.9rem] text-fg font-medium truncate">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </span>
                <span className="text-fg-muted text-[0.8rem]">{match.date}</span>
                <Button size="sm">Predecir</Button>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Últimos resultados</CardTitle>
          <div className="mt-4 space-y-3">
            {mockStats.lastResults.length === 0 && <p className="text-fg-muted text-[0.9rem]">Sin resultados aún</p>}
            {mockStats.lastResults.map((r, i) => (
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
