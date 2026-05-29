"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { SkeletonStats, ErrorState } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useMatches, useStats } from "@/lib/hooks";

// Stadium Vibrant — versión dark del landing.
// Fondo indigo profundo (NO negro) + acentos esmeralda/cobalto/violeta/magenta/dorado.
const COLORS = {
  bgPage: "#14122E",       // indigo profundo (override del bg-bg-primary midnight)
  bgSurface: "#1F1B3D",    // card surface
  bgElevated: "#2A2552",   // hover / elevated
  textPrimary: "#FFFFFF",
  textSecondary: "#B4B0D6",
  textMuted: "#7A759C",
  border: "#322B5F",
  emerald: "#00C896",
  cobalt: "#4D7CFF",
  violet: "#A855F7",
  magenta: "#FF3D7F",
  gold: "#FFB800",
  red: "#FF5470",
};

// Acentos por stat card (4 colores)
const STAT_ACCENTS = [
  { color: COLORS.emerald, glow: "0,200,150" },
  { color: COLORS.cobalt, glow: "77,124,255" },
  { color: COLORS.violet, glow: "168,85,247" },
  { color: COLORS.gold, glow: "255,184,0" },
];

const QUICK_ACTIONS = [
  {
    href: "/matches",
    label: "Calendario",
    desc: "Explorá todos los partidos y predicí",
    icon: "⚽",
    color: COLORS.emerald,
    glow: "0,200,150",
  },
  {
    href: "/leaderboard",
    label: "Ranking Global",
    desc: "Comparate con miles de jugadores",
    icon: "🏆",
    color: COLORS.gold,
    glow: "255,184,0",
  },
  {
    href: "/groups",
    label: "Mis Grupos",
    desc: "Competí con amigos en privado",
    icon: "👥",
    color: COLORS.violet,
    glow: "168,85,247",
  },
  {
    href: "/predictions",
    label: "Mis Predicciones",
    desc: "Revisá tu historial de pronósticos",
    icon: "🎯",
    color: COLORS.magenta,
    glow: "255,61,127",
  },
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
    return (
      <span className="text-[0.75rem] font-bold" style={{ color: COLORS.red }}>
        Cerrado
      </span>
    );
  }
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const text = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const soon = remaining < SOON_THRESHOLD_MS;
  return (
    <span
      className="text-[0.75rem] font-bold tabular-nums"
      style={{ color: soon ? COLORS.magenta : COLORS.textMuted }}
      aria-label={`Tiempo restante para predecir: ${text}`}
    >
      ⏱ {text}
    </span>
  );
}

function SectionCard({
  children,
  accent,
  title,
}: {
  children: React.ReactNode;
  accent: string;
  title: string;
}) {
  return (
    <div
      className="rounded-[18px] overflow-hidden"
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{
          background: `linear-gradient(90deg, ${accent}22, transparent)`,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <h3 className="text-[1.05rem] font-bold" style={{ color: COLORS.textPrimary }}>
          {title}
        </h3>
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
      </div>
      <div className="p-5">{children}</div>
    </div>
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
      {/* Overlay de fondo Stadium: tinte indigo profundo + dos blobs sutiles */}
      <div
        className="fixed inset-0 pointer-events-none -z-0"
        style={{ background: COLORS.bgPage }}
        aria-hidden
      />
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none -z-0"
        style={{
          background: `radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)`,
          transform: "translate(30%, -30%)",
        }}
        aria-hidden
      />
      <div
        className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none -z-0"
        style={{
          background: `radial-gradient(circle, rgba(0,200,150,0.10), transparent 70%)`,
          transform: "translate(-30%, 30%)",
        }}
        aria-hidden
      />

      <div className="relative">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-[2rem] max-md:text-[1.5rem] font-extrabold tracking-tight">
            ¡Bienvenido,{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.cobalt}, ${COLORS.violet})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {user?.name?.split(" ")[0] || "Jugador"}
            </span>
            !
          </h1>
          <p className="text-[0.95rem] mt-2" style={{ color: COLORS.textSecondary }}>
            Esto es lo que está pasando en tu quiniela
          </p>
        </div>

        {/* Stats */}
        {statsLoading && <SkeletonStats count={4} />}
        {!statsLoading && statsError && (
          <div className="mb-10">
            <ErrorState message={statsError} onRetry={refetchStats} />
          </div>
        )}
        {!statsLoading && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Puntos totales", value: stats.totalPoints, hint: "+12 esta semana", up: true },
              { label: "Ranking global", value: `#${stats.globalRank}`, hint: "Subiste 2 posiciones", up: true },
              {
                label: "Ranking grupo",
                value: stats.groupRank !== null ? `#${stats.groupRank}` : "—",
                hint: stats.groupName || "—",
                up: null,
              },
              { label: "Pendientes", value: stats.predictionsPending, hint: "predicciones abiertas", up: null },
            ].map((s, i) => {
              const accent = STAT_ACCENTS[i];
              return (
                <div
                  key={s.label}
                  className="relative rounded-[16px] p-5 overflow-hidden transition-all duration-200"
                  style={{
                    background: COLORS.bgSurface,
                    border: `1px solid ${COLORS.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 12px 28px rgba(${accent.glow},0.25)`;
                    e.currentTarget.style.borderColor = accent.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = COLORS.border;
                  }}
                >
                  {/* Barra de acento superior */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: accent.color }}
                  />
                  <div
                    className="text-[0.72rem] font-bold uppercase tracking-widest mb-2"
                    style={{ color: accent.color }}
                  >
                    {s.label}
                  </div>
                  <div
                    className="text-[2rem] font-extrabold leading-none mb-1.5"
                    style={{ color: COLORS.textPrimary }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[0.75rem]"
                    style={{
                      color:
                        s.up === true
                          ? COLORS.emerald
                          : s.up === false
                            ? COLORS.red
                            : COLORS.textMuted,
                    }}
                  >
                    {s.up === true && "▲ "}
                    {s.up === false && "▼ "}
                    {s.hint}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Two side cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <SectionCard title="Próximos por cerrar" accent={COLORS.magenta}>
            <div className="space-y-2.5">
              {matchesLoading && (
                <p className="text-[0.9rem]" style={{ color: COLORS.textMuted }}>
                  Cargando...
                </p>
              )}
              {!matchesLoading && upcoming.length === 0 && (
                <p className="text-[0.9rem]" style={{ color: COLORS.textMuted }}>
                  No hay partidos próximos abiertos
                </p>
              )}
              {upcoming.map((match) => {
                const remaining = new Date(match.predictionDeadline).getTime() - Date.now();
                const soon = remaining > 0 && remaining < SOON_THRESHOLD_MS;
                return (
                  <Link
                    key={match.id}
                    href={`/matches/${match.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-[12px] no-underline transition-all"
                    style={{ background: COLORS.bgPage, border: `1px solid ${COLORS.border}` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = COLORS.bgElevated;
                      e.currentTarget.style.borderColor = COLORS.magenta;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = COLORS.bgPage;
                      e.currentTarget.style.borderColor = COLORS.border;
                    }}
                  >
                    <span className="text-[1.3rem]">{match.homeTeam.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[0.9rem] font-semibold truncate" style={{ color: COLORS.textPrimary }}>
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <CountdownLabel deadline={match.predictionDeadline} />
                        {soon && (
                          <span
                            className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: `${COLORS.magenta}22`, color: COLORS.magenta }}
                          >
                            Cierra pronto
                          </span>
                        )}
                      </div>
                    </div>
                    {match.userPrediction ? (
                      <span
                        className="text-[0.95rem] font-mono font-bold tabular-nums"
                        style={{ color: COLORS.gold }}
                      >
                        {match.userPrediction.homeScore}–{match.userPrediction.awayScore}
                      </span>
                    ) : (
                      <span
                        className="text-[0.75rem] font-bold uppercase tracking-wide px-3 py-1.5 rounded-[8px]"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.cobalt})`,
                          color: "#FFFFFF",
                        }}
                      >
                        Predecir
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Últimos resultados" accent={COLORS.gold}>
            <div className="space-y-2.5">
              {statsLoading && (
                <p className="text-[0.9rem]" style={{ color: COLORS.textMuted }}>
                  Cargando...
                </p>
              )}
              {!statsLoading && stats && stats.lastResults.length === 0 && (
                <p className="text-[0.9rem]" style={{ color: COLORS.textMuted }}>
                  Sin resultados aún
                </p>
              )}
              {!statsLoading &&
                stats?.lastResults.map((r, i) => {
                  const isExact = r.prediction.status === "exact";
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 rounded-[12px]"
                      style={{ background: COLORS.bgPage, border: `1px solid ${COLORS.border}` }}
                    >
                      <span className="text-[1.3rem]">{r.match.homeTeam.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.9rem] font-semibold truncate" style={{ color: COLORS.textPrimary }}>
                          {r.match.homeTeam.name} vs {r.match.awayTeam.name}
                        </div>
                        <div className="text-[0.72rem] mt-0.5 flex items-center gap-1.5">
                          <span
                            className="font-bold uppercase tracking-wide"
                            style={{ color: isExact ? COLORS.gold : COLORS.emerald }}
                          >
                            {isExact ? "★ Exacta" : "✓ Acertada"}
                          </span>
                          <span style={{ color: COLORS.textMuted }}>· {r.points} pts</span>
                        </div>
                      </div>
                      <span
                        className="font-extrabold text-[1.15rem] tabular-nums"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {r.match.homeScore}–{r.match.awayScore}
                      </span>
                    </div>
                  );
                })}
            </div>
          </SectionCard>
        </div>

        {/* Quick actions */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="text-[0.78rem] font-bold uppercase tracking-widest"
            style={{ color: COLORS.violet }}
          >
            Acceso rápido
          </span>
          <span className="flex-1 h-px" style={{ background: COLORS.border }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="relative rounded-[16px] p-5 no-underline overflow-hidden transition-all duration-200"
              style={{
                background: COLORS.bgSurface,
                border: `1px solid ${COLORS.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 14px 32px rgba(${a.glow},0.30)`;
                e.currentTarget.style.borderColor = a.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = COLORS.border;
              }}
            >
              <div
                className="w-12 h-12 rounded-[12px] grid place-items-center text-[1.6rem] mb-4"
                style={{ background: `${a.color}22` }}
              >
                {a.icon}
              </div>
              <h3 className="text-[1rem] font-bold mb-1" style={{ color: COLORS.textPrimary }}>
                {a.label}
              </h3>
              <p className="text-[0.8rem] leading-relaxed" style={{ color: COLORS.textSecondary }}>
                {a.desc}
              </p>
              <span
                className="absolute bottom-3 right-4 text-[1rem] font-bold"
                style={{ color: a.color }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
