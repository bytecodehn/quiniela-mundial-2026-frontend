"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button, Card, ErrorState, Input, SkeletonStats, StatCard } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useStats } from "@/lib/hooks";

const countries = [
  { value: "AR", label: "🇦🇷 Argentina" },
  { value: "BR", label: "🇧🇷 Brasil" },
  { value: "CL", label: "🇨🇱 Chile" },
  { value: "CO", label: "🇨🇴 Colombia" },
  { value: "EC", label: "🇪🇨 Ecuador" },
  { value: "ES", label: "🇪🇸 España" },
  { value: "FR", label: "🇫🇷 Francia" },
  { value: "DE", label: "🇩🇪 Alemania" },
  { value: "IT", label: "🇮🇹 Italia" },
  { value: "MX", label: "🇲🇽 México" },
  { value: "NL", label: "🇳🇱 Países Bajos" },
  { value: "PE", label: "🇵🇪 Perú" },
  { value: "PT", label: "🇵🇹 Portugal" },
  { value: "GB", label: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra" },
  { value: "UY", label: "🇺🇾 Uruguay" },
];

const teams = [
  "Argentina", "Brasil", "Uruguay", "Chile", "España", "Alemania",
  "Francia", "Inglaterra", "Italia", "Países Bajos", "Portugal",
  "México", "Colombia", "Ecuador", "Perú",
];

function teamFlag(name: string): string {
  const t = countries.find((c) => c.label.includes(name));
  return t ? t.label.split(" ")[0] : "🏳️";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: stats, loading: statsLoading, error: statsError, refetch } = useStats();
  const [name, setName] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [country, setCountry] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setFavoriteTeam(user.favoriteTeam);
      setCountry(user.country);
    }
  }, [user]);

  if (!user) {
    return (
      <AppLayout>
        <SkeletonStats count={6} />
      </AppLayout>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-[1.8rem] font-display font-bold text-fg">Mi Perfil</h1>
        <p className="text-fg-secondary text-[0.95rem] mt-1">
          Administra tu información personal
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green to-cyan grid place-items-center text-white font-bold text-[1.5rem] shrink-0">
                {user.avatar}
              </div>
              <div>
                <h2 className="text-[1.2rem] font-bold text-fg">{user.name}</h2>
                <p className="text-[0.85rem] text-fg-secondary">{user.email}</p>
                <p className="text-[0.75rem] text-fg-muted mt-1">
                  Miembro desde {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-[1.05rem] font-bold text-fg mb-5">Editar perfil</h3>
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              value={user.email}
              disabled
            />
            <div className="mb-5">
              <label className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">País</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-radius-md text-fg text-[0.95rem] outline-none transition-colors duration-150 focus:border-green focus:shadow-[0_0_0_3px_oklch(60%_0.18_145/0.15)]"
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">
                Selección favorita
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={favoriteTeam}
                  onChange={(e) => setFavoriteTeam(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-bg-primary border border-border rounded-radius-md text-fg text-[0.95rem] outline-none transition-colors duration-150 focus:border-green focus:shadow-[0_0_0_3px_oklch(60%_0.18_145/0.15)]"
                >
                  {teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="text-[2rem]">{teamFlag(favoriteTeam)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSave}>
                {saved ? "✓ Guardado" : "Guardar cambios"}
              </Button>
              {saved && (
                <span className="text-[0.85rem] text-green font-semibold">
                  Cambios guardados correctamente
                </span>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-[1.05rem] font-bold text-fg mb-5">Estadísticas</h3>
            {statsLoading && <SkeletonStats count={6} />}
            {!statsLoading && statsError && <ErrorState message={statsError} onRetry={refetch} />}
            {!statsLoading && !statsError && stats && (
              <div className="grid grid-cols-2 gap-5">
                <StatCard label="Puntos" value={stats.totalPoints} />
                <StatCard label="Ranking Global" value={`#${stats.globalRank}`} />
                <StatCard label="Predicciones" value={stats.predictionsTotal} />
                <StatCard label="Exactas" value={stats.exactCount} />
                <StatCard label="Aciertos" value={stats.correctCount} />
                <StatCard label="Grupo" value={stats.groupName || "—"} />
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-[1.05rem] font-bold text-fg mb-4">Selección favorita</h3>
            <div className="flex items-center gap-4">
              <span className="text-[3rem]">{teamFlag(favoriteTeam)}</span>
              <div>
                <div className="text-[1.1rem] font-bold text-fg">{favoriteTeam}</div>
                <div className="text-[0.8rem] text-fg-muted">Mi equipo</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
