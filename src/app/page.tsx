"use client";

/* eslint-disable @next/next/no-img-element */
// Las banderas vienen de flagcdn.com; son SVG/PNG pequeñas (20-30px de alto),
// usar next/image obligaría a configurar remotePatterns sin beneficio real.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGlobalLeaderboard } from "@/lib/hooks";
import {
  WC_GROUPS,
  WC_HOST_COUNTRIES,
  WC_SAMPLE_MATCHES,
  flagUrl,
  type WCGroupName,
} from "@/lib/mundial-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Quiniela Mundial 2026",
  url: SITE_URL,
  description:
    "Plataforma social de predicciones deportivas para la Copa Mundial 2026. Predicciones, rankings y grupos privados.",
  sameAs: [] as string[],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Quiniela Mundial 2026",
  url: SITE_URL,
  inLanguage: "es-AR",
};

const navLinks = [
  { href: "#grupos", label: "Grupos" },
  { href: "#calendario", label: "Calendario" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ranking", label: "Ranking" },
];

const steps = [
  {
    number: "01",
    title: "Registrate gratis",
    desc: "Crea tu cuenta en menos de un minuto. Solo necesitás un email.",
    color: "#00C896",
  },
  {
    number: "02",
    title: "Pronosticá los 104 partidos",
    desc: "Predecí el marcador antes del pitazo inicial. Cuanto más exacto, más puntos.",
    color: "#4D7CFF",
  },
  {
    number: "03",
    title: "Ganá puntos y competí",
    desc: "Escalá el ranking global y desafiá a tus amigos en grupos privados.",
    color: "#FF3D7F",
  },
];

const features = [
  {
    icon: "🎯",
    title: "Predicciones",
    desc: "Pronosticá el resultado de cada partido del Mundial.",
    bg: "#E0F9F1",
    fg: "#007A5C",
  },
  {
    icon: "🏆",
    title: "Rankings",
    desc: "Compite con miles de usuarios y demostrá quién sabe más.",
    bg: "#FFF3D6",
    fg: "#8A6300",
  },
  {
    icon: "👥",
    title: "Grupos privados",
    desc: "Creá grupos con amigos, familia o el trabajo.",
    bg: "#EAE4FF",
    fg: "#4F2EBA",
  },
  {
    icon: "📊",
    title: "Estadísticas",
    desc: "Aciertos exactos, rachas, porcentaje y más métricas.",
    bg: "#FFE0EB",
    fg: "#B91C5C",
  },
];

// Acentos por grupo (5 colores cíclicos)
const GROUP_ACCENTS: { bg: string; fg: string; border: string }[] = [
  { bg: "linear-gradient(135deg,#00C896,#00A37A)", fg: "#FFFFFF", border: "#00C896" }, // A,F,K
  { bg: "linear-gradient(135deg,#4D7CFF,#3358D4)", fg: "#FFFFFF", border: "#4D7CFF" }, // B,G,L
  { bg: "linear-gradient(135deg,#7C3AED,#5B21B6)", fg: "#FFFFFF", border: "#7C3AED" }, // C,H
  { bg: "linear-gradient(135deg,#FF3D7F,#D11A5A)", fg: "#FFFFFF", border: "#FF3D7F" }, // D,I
  { bg: "linear-gradient(135deg,#FFB800,#E08F00)", fg: "#1A1A2E", border: "#FFB800" }, // E,J
];

function groupAccent(name: WCGroupName) {
  const idx = name.charCodeAt(0) - "A".charCodeAt(0);
  return GROUP_ACCENTS[idx % GROUP_ACCENTS.length];
}

const CONFED_COLOR: Record<string, string> = {
  UEFA: "#4D7CFF",
  CONMEBOL: "#FFB800",
  CONCACAF: "#00C896",
  CAF: "#FF3D7F",
  AFC: "#7C3AED",
  OFC: "#0EA5E9",
  PLAYOFF: "#9CA3AF",
};

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGroupTab, setActiveGroupTab] = useState<WCGroupName | "all">("all");
  const { data: leaderboardData, loading: leaderboardLoading } = useGlobalLeaderboard();

  const top3 = leaderboardData?.leaderboard.slice(0, 3) ?? [];
  const recordPoints = top3[0]?.points;

  const visibleMatches = useMemo(
    () =>
      activeGroupTab === "all"
        ? WC_SAMPLE_MATCHES
        : WC_SAMPLE_MATCHES.filter((m) => m.group === activeGroupTab),
    [activeGroupTab],
  );

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F0", color: "#1A1A2E" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ============ HEADER ============ */}
      <header
        className="sticky top-0 z-50 backdrop-blur-lg"
        style={{
          background: "rgba(255,248,240,0.85)",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div
              className="w-9 h-9 grid place-items-center text-[1.2rem] font-extrabold text-white rounded-[10px]"
              style={{ background: "linear-gradient(135deg,#00C896,#4D7CFF)" }}
            >
              Q
            </div>
            <span className="font-bold text-[1.1rem] max-md:hidden" style={{ color: "#1A1A2E" }}>
              Quiniela 2026
            </span>
          </Link>

          <nav className="flex items-center gap-1 max-md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[0.9rem] rounded-[10px] transition-colors no-underline"
                style={{ color: "#4A5568" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A2E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5568")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-[0.9rem] font-semibold no-underline rounded-[10px]"
              style={{ color: "#1A1A2E" }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="max-md:hidden px-5 py-2.5 text-[0.9rem] font-semibold rounded-[10px] text-white no-underline transition-transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#00C896,#4D7CFF)",
                boxShadow: "0 4px 14px rgba(77,124,255,0.35)",
              }}
            >
              Registrarme gratis
            </Link>
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={mobileMenuOpen}
              className="hidden max-md:flex w-9 h-9 items-center justify-center text-[1.4rem] border-none cursor-pointer bg-transparent"
              style={{ color: "#1A1A2E" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="max-md:flex flex-col p-4 gap-1 hidden"
            style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-[0.95rem] no-underline rounded-[10px]"
                style={{ color: "#4A5568" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center mt-2 px-5 py-3 text-[0.95rem] font-semibold rounded-[10px] text-white no-underline"
              style={{ background: "linear-gradient(135deg,#00C896,#4D7CFF)" }}
            >
              Registrarme gratis
            </Link>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#00C896 0%,#4D7CFF 45%,#7C3AED 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(255,184,0,0.35),transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(255,61,127,0.35),transparent 70%)" }}
        />

        <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-28 max-md:pt-14 max-md:pb-20 text-center relative">
          {/* Banderas anfitriones */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {WC_HOST_COUNTRIES.map((c) => (
              <div
                key={c.code}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.78rem] font-semibold text-white"
                style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
              >
                <img
                  src={flagUrl(c.code, 40)}
                  alt={c.name}
                  width={20}
                  height={14}
                  className="rounded-[2px]"
                />
                {c.name}
              </div>
            ))}
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.8rem] font-bold text-white mb-6"
            style={{
              background: "rgba(255,184,0,0.95)",
              color: "#1A1A2E",
              boxShadow: "0 6px 20px rgba(255,184,0,0.45)",
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#1A1A2E" }} />
            MUNDIAL 2026 · 48 selecciones · 104 partidos
          </div>

          <h1 className="text-[4.2rem] max-md:text-[2.6rem] leading-[1.05] font-extrabold tracking-tight mb-6 max-w-[900px] mx-auto text-white">
            Pronosticá el Mundial.
            <br />
            <span style={{ color: "#FFB800" }}>Ganale a tus amigos.</span>
          </h1>

          <p className="text-[1.2rem] max-md:text-[1rem] max-w-[640px] mx-auto mb-10 leading-relaxed text-white/90">
            La quiniela social del Mundial 2026 en Canadá, EE.UU. y México.
            Competí en grupos privados, escalá el ranking global y demostrá que
            sos el que más sabe de fútbol.
          </p>

          <div className="flex items-center justify-center gap-4 max-md:flex-col">
            <Link
              href="/register"
              className="px-10 py-4 text-[1.1rem] font-bold rounded-[14px] no-underline transition-transform hover:-translate-y-0.5"
              style={{
                background: "#FFFFFF",
                color: "#7C3AED",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
              }}
            >
              Registrarme gratis
            </Link>
            <Link
              href="#grupos"
              className="px-10 py-4 text-[1.1rem] font-bold rounded-[14px] no-underline text-white border-2 border-white/70 hover:bg-white/10 transition-colors"
            >
              Ver los 12 grupos
            </Link>
          </div>

          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6 max-w-[720px] mx-auto mt-16 max-md:gap-4">
            {[
              { v: "48", l: "Selecciones" },
              { v: "12", l: "Grupos" },
              { v: "104", l: "Partidos" },
              { v: recordPoints ? `${recordPoints}` : "—", l: "Récord puntos" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-[2.4rem] max-md:text-[1.8rem] font-extrabold text-white">
                  {s.v}
                </div>
                <div className="text-[0.78rem] text-white/75 font-semibold uppercase tracking-wider">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 12 GRUPOS ============ */}
      <section id="grupos" className="relative">
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-14">
          <div className="text-center mb-12">
            <span
              className="text-[0.78rem] font-bold uppercase tracking-widest"
              style={{ color: "#00C896" }}
            >
              Los 12 grupos
            </span>
            <h2 className="text-[2.6rem] max-md:text-[1.9rem] font-extrabold mt-3" style={{ color: "#1A1A2E" }}>
              48 selecciones, un solo campeón
            </h2>
            <p className="text-[1rem] mt-3 max-w-[560px] mx-auto" style={{ color: "#4A5568" }}>
              Sorteo simulado a modo de muestra. Cuando FIFA publique el draw
              oficial, los grupos se actualizan automáticamente.
            </p>
          </div>

          <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
            {WC_GROUPS.map((g) => {
              const accent = groupAccent(g.name);
              return (
                <div
                  key={g.name}
                  className="rounded-[16px] overflow-hidden transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 16px rgba(26,26,46,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 28px ${accent.border}33`;
                    e.currentTarget.style.borderColor = accent.border;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,26,46,0.06)";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                  }}
                >
                  <div
                    className="px-5 py-3 flex items-center justify-between"
                    style={{ background: accent.bg, color: accent.fg }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[0.7rem] font-bold uppercase tracking-widest opacity-80">
                        Grupo
                      </span>
                      <span className="text-[1.6rem] font-extrabold leading-none">
                        {g.name}
                      </span>
                    </div>
                    <span className="text-[0.7rem] font-semibold opacity-80">
                      4 equipos
                    </span>
                  </div>

                  <ul className="p-4 flex flex-col gap-2.5">
                    {g.teams.map((t) => (
                      <li
                        key={t.code}
                        className="flex items-center gap-3 px-3 py-2 rounded-[10px] transition-colors"
                        style={{ background: "#FAFAFC" }}
                      >
                        <img
                          src={flagUrl(t.code, 40)}
                          alt={t.name}
                          width={28}
                          height={20}
                          className="rounded-[3px] object-cover flex-shrink-0"
                          style={{ background: "#E5E7EB" }}
                        />
                        <span className="flex-1 text-[0.92rem] font-semibold truncate" style={{ color: "#1A1A2E" }}>
                          {t.name}
                        </span>
                        <span
                          className="text-[0.62rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            color: CONFED_COLOR[t.confed],
                            background: `${CONFED_COLOR[t.confed]}1A`,
                          }}
                        >
                          {t.confed === "PLAYOFF" ? "TBD" : t.confed}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CALENDARIO ============ */}
      <section
        id="calendario"
        style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#F5EFFF 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-14">
          <div className="text-center mb-10">
            <span
              className="text-[0.78rem] font-bold uppercase tracking-widest"
              style={{ color: "#7C3AED" }}
            >
              Calendario · Matchday 1
            </span>
            <h2 className="text-[2.6rem] max-md:text-[1.9rem] font-extrabold mt-3" style={{ color: "#1A1A2E" }}>
              Los primeros partidos del Mundial
            </h2>
          </div>

          {/* Tabs por grupo */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div
              className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-[14px]"
              style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <button
                type="button"
                onClick={() => setActiveGroupTab("all")}
                className="px-4 py-2 text-[0.85rem] font-bold rounded-[10px] transition-all"
                style={
                  activeGroupTab === "all"
                    ? {
                        background: "linear-gradient(135deg,#00C896,#4D7CFF)",
                        color: "#FFFFFF",
                      }
                    : { background: "transparent", color: "#4A5568" }
                }
              >
                Todos
              </button>
              {WC_GROUPS.map((g) => {
                const accent = groupAccent(g.name);
                const isActive = activeGroupTab === g.name;
                return (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => setActiveGroupTab(g.name)}
                    className="px-3.5 py-2 text-[0.85rem] font-bold rounded-[10px] transition-all"
                    style={
                      isActive
                        ? { background: accent.bg, color: accent.fg }
                        : { background: "transparent", color: "#4A5568" }
                    }
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>

          {visibleMatches.length === 0 ? (
            <p className="text-center text-[0.95rem]" style={{ color: "#718096" }}>
              Sin partidos de muestra para este grupo todavía.
            </p>
          ) : (
            <div className="grid gap-3 max-w-[820px] mx-auto">
              {visibleMatches.map((m, idx) => {
                const accent = groupAccent(m.group);
                return (
                  <div
                    key={idx}
                    className="rounded-[14px] p-5 flex items-center gap-4 max-md:flex-col max-md:gap-3"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 2px 10px rgba(26,26,46,0.05)",
                    }}
                  >
                    <span
                      className="px-2.5 py-1 rounded-[8px] text-[0.7rem] font-bold flex-shrink-0"
                      style={{ background: accent.bg, color: accent.fg }}
                    >
                      GRUPO {m.group}
                    </span>

                    <div className="flex items-center gap-3 flex-1 max-md:w-full max-md:justify-center">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-[0.95rem] font-bold text-right" style={{ color: "#1A1A2E" }}>
                          {m.home.name}
                        </span>
                        <img
                          src={flagUrl(m.home.code, 40)}
                          alt={m.home.name}
                          width={30}
                          height={22}
                          className="rounded-[3px]"
                        />
                      </div>
                      <span className="text-[0.7rem] font-bold uppercase" style={{ color: "#9CA3AF" }}>
                        vs
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={flagUrl(m.away.code, 40)}
                          alt={m.away.name}
                          width={30}
                          height={22}
                          className="rounded-[3px]"
                        />
                        <span className="text-[0.95rem] font-bold" style={{ color: "#1A1A2E" }}>
                          {m.away.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end max-md:items-center flex-shrink-0">
                      <span className="text-[0.85rem] font-bold" style={{ color: "#1A1A2E" }}>
                        {m.dateLabel} · {m.timeLabel}
                      </span>
                      <span className="text-[0.75rem]" style={{ color: "#718096" }}>
                        {m.stadium}, {m.city}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/register"
              className="inline-flex px-8 py-3 text-[1rem] font-bold rounded-[12px] text-white no-underline transition-transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#7C3AED,#FF3D7F)",
                boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
              }}
            >
              Pronosticá todos los partidos →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section id="como-funciona">
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-14">
          <div className="text-center mb-14">
            <span
              className="text-[0.78rem] font-bold uppercase tracking-widest"
              style={{ color: "#FF3D7F" }}
            >
              Cómo funciona
            </span>
            <h2 className="text-[2.6rem] max-md:text-[1.9rem] font-extrabold mt-3" style={{ color: "#1A1A2E" }}>
              Tres pasos y listo
            </h2>
          </div>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
            {steps.map((s) => (
              <div
                key={s.number}
                className="rounded-[18px] p-7 text-left transition-transform hover:-translate-y-1"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  boxShadow: `0 6px 20px ${s.color}1F`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-[12px] grid place-items-center font-extrabold text-[1.1rem] text-white mb-5"
                  style={{ background: s.color }}
                >
                  {s.number}
                </div>
                <h3 className="text-[1.25rem] font-bold mb-2" style={{ color: "#1A1A2E" }}>
                  {s.title}
                </h3>
                <p className="text-[0.95rem] leading-relaxed" style={{ color: "#4A5568" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid #E5E7EB" }}>
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-14">
          <div className="text-center mb-14">
            <span
              className="text-[0.78rem] font-bold uppercase tracking-widest"
              style={{ color: "#4D7CFF" }}
            >
              Características
            </span>
            <h2 className="text-[2.6rem] max-md:text-[1.9rem] font-extrabold mt-3" style={{ color: "#1A1A2E" }}>
              Todo lo que necesitás
            </h2>
          </div>

          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-[16px] p-6 transition-transform hover:-translate-y-1"
                style={{
                  background: "#FAFAFC",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  className="w-14 h-14 rounded-[12px] grid place-items-center text-[1.7rem] mb-4"
                  style={{ background: f.bg, color: f.fg }}
                >
                  {f.icon}
                </div>
                <h3 className="text-[1.05rem] font-bold mb-2" style={{ color: "#1A1A2E" }}>
                  {f.title}
                </h3>
                <p className="text-[0.88rem] leading-relaxed" style={{ color: "#4A5568" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RANKING PODIUM ============ */}
      {!leaderboardLoading && top3.length === 3 && (
        <section id="ranking">
          <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-14">
            <div className="text-center mb-14">
              <span
                className="text-[0.78rem] font-bold uppercase tracking-widest"
                style={{ color: "#FFB800" }}
              >
                Ranking global
              </span>
              <h2 className="text-[2.6rem] max-md:text-[1.9rem] font-extrabold mt-3" style={{ color: "#1A1A2E" }}>
                Los mejores del mundo
              </h2>
            </div>

            <div className="flex items-end justify-center gap-4 max-md:gap-2 max-w-[700px] mx-auto">
              {/* 2do */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-14 h-14 max-md:w-11 max-md:h-11 rounded-full grid place-items-center font-bold text-white text-[1rem] mb-2"
                  style={{ background: "linear-gradient(135deg,#9CA3AF,#6B7280)" }}
                >
                  {top3[1].avatar}
                </div>
                <div
                  className="text-[0.85rem] max-md:text-[0.75rem] font-bold text-center truncate max-w-[120px]"
                  style={{ color: "#1A1A2E" }}
                >
                  {top3[1].name}
                </div>
                <div className="text-[0.75rem] font-medium" style={{ color: "#718096" }}>
                  {top3[1].points} pts
                </div>
                <div
                  className="mt-2 w-full h-[110px] max-md:h-[80px] rounded-t-[14px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(180deg,#E5E7EB,#FFFFFF)",
                    border: "1px solid #E5E7EB",
                    borderBottom: "none",
                  }}
                >
                  <span className="text-[2rem] max-md:text-[1.4rem] font-extrabold" style={{ color: "#9CA3AF" }}>
                    2
                  </span>
                </div>
              </div>

              {/* 1ro */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div
                    className="w-16 h-16 max-md:w-[52px] max-md:h-[52px] rounded-full grid place-items-center font-bold text-[1.1rem] mb-2 ring-4 ring-white"
                    style={{
                      background: "linear-gradient(135deg,#FFB800,#FF8A00)",
                      color: "#1A1A2E",
                      boxShadow: "0 8px 24px rgba(255,184,0,0.5)",
                    }}
                  >
                    {top3[0].avatar}
                  </div>
                  <div className="absolute -top-2 -right-1 text-[1.4rem]">👑</div>
                </div>
                <div
                  className="text-[0.95rem] max-md:text-[0.85rem] font-extrabold text-center truncate max-w-[140px]"
                  style={{ color: "#1A1A2E" }}
                >
                  {top3[0].name}
                </div>
                <div className="text-[0.85rem] font-bold" style={{ color: "#FFB800" }}>
                  {top3[0].points} pts
                </div>
                <div
                  className="mt-2 w-full h-[150px] max-md:h-[105px] rounded-t-[14px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(180deg,#FFB800,#FFD974)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
                  }}
                >
                  <span className="text-[2.4rem] max-md:text-[1.7rem] font-extrabold" style={{ color: "#1A1A2E" }}>
                    1
                  </span>
                </div>
              </div>

              {/* 3ro */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-14 h-14 max-md:w-11 max-md:h-11 rounded-full grid place-items-center font-bold text-white text-[1rem] mb-2"
                  style={{ background: "linear-gradient(135deg,#FF7A45,#E94B1A)" }}
                >
                  {top3[2].avatar}
                </div>
                <div
                  className="text-[0.85rem] max-md:text-[0.75rem] font-bold text-center truncate max-w-[120px]"
                  style={{ color: "#1A1A2E" }}
                >
                  {top3[2].name}
                </div>
                <div className="text-[0.75rem] font-medium" style={{ color: "#718096" }}>
                  {top3[2].points} pts
                </div>
                <div
                  className="mt-2 w-full h-[90px] max-md:h-[65px] rounded-t-[14px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(180deg,#FFB394,#FFE2D2)",
                    border: "1px solid #FFB394",
                    borderBottom: "none",
                  }}
                >
                  <span className="text-[1.7rem] max-md:text-[1.2rem] font-extrabold" style={{ color: "#B45309" }}>
                    3
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/register"
                className="inline-flex px-8 py-3 text-[0.95rem] font-bold rounded-[12px] no-underline border-2"
                style={{ color: "#1A1A2E", borderColor: "#1A1A2E", background: "transparent" }}
              >
                Ver ranking completo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA FINAL ============ */}
      <section className="px-6 pb-20 max-md:pb-14">
        <div
          className="max-w-[1100px] mx-auto rounded-[28px] px-10 py-16 max-md:px-6 max-md:py-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#FF3D7F 0%,#7C3AED 50%,#4D7CFF 100%)",
            boxShadow: "0 20px 60px rgba(124,58,237,0.35)",
          }}
        >
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(255,184,0,0.4),transparent 70%)" }}
          />
          <h2 className="text-[2.6rem] max-md:text-[1.9rem] font-extrabold text-white mb-4 relative">
            ¿Listo para el desafío?
          </h2>
          <p className="text-[1.1rem] text-white/90 max-w-[520px] mx-auto mb-8 relative">
            Sumate a miles de fans que ya están armando su quiniela del Mundial 2026.
          </p>
          <Link
            href="/register"
            className="inline-flex px-10 py-4 text-[1.1rem] font-bold rounded-[14px] no-underline transition-transform hover:-translate-y-0.5 relative"
            style={{
              background: "#FFFFFF",
              color: "#7C3AED",
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
          >
            Empezar gratis →
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ background: "#1E1B4B", color: "#E5E7EB" }}>
        <div className="max-w-[1280px] mx-auto px-6 py-14 max-md:py-10">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-8 mb-10">
            <div className="max-md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-[10px] grid place-items-center text-[1.1rem] font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg,#00C896,#4D7CFF)" }}
                >
                  Q
                </div>
                <span className="font-bold text-[1.05rem] text-white">
                  Quiniela 2026
                </span>
              </div>
              <p className="text-[0.88rem] leading-relaxed max-w-[300px]" style={{ color: "#A5A5C9" }}>
                La plataforma social de predicciones del Mundial 2026.
                Competí, divertite y demostrá tu conocimiento.
              </p>
            </div>
            <div>
              <h4 className="text-[0.75rem] font-bold uppercase tracking-widest mb-4" style={{ color: "#FFB800" }}>
                Plataforma
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/login" className="text-[0.9rem] no-underline hover:text-white" style={{ color: "#A5A5C9" }}>
                  Iniciar sesión
                </Link>
                <Link href="/register" className="text-[0.9rem] no-underline hover:text-white" style={{ color: "#A5A5C9" }}>
                  Registrarse
                </Link>
                <Link href="/matches" className="text-[0.9rem] no-underline hover:text-white" style={{ color: "#A5A5C9" }}>
                  Partidos
                </Link>
                <Link href="/leaderboard" className="text-[0.9rem] no-underline hover:text-white" style={{ color: "#A5A5C9" }}>
                  Ranking
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-[0.75rem] font-bold uppercase tracking-widest mb-4" style={{ color: "#00C896" }}>
                Comunidad
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/groups" className="text-[0.9rem] no-underline hover:text-white" style={{ color: "#A5A5C9" }}>
                  Grupos
                </Link>
                <span className="text-[0.9rem]" style={{ color: "#6E6E94" }}>Foro (pronto)</span>
                <span className="text-[0.9rem]" style={{ color: "#6E6E94" }}>Blog (pronto)</span>
              </div>
            </div>
            <div>
              <h4 className="text-[0.75rem] font-bold uppercase tracking-widest mb-4" style={{ color: "#FF3D7F" }}>
                Legal
              </h4>
              <div className="flex flex-col gap-2.5">
                <span className="text-[0.9rem]" style={{ color: "#6E6E94" }}>Términos y condiciones</span>
                <span className="text-[0.9rem]" style={{ color: "#6E6E94" }}>Política de privacidad</span>
              </div>
            </div>
          </div>
          <div
            className="pt-6 flex items-center justify-between text-[0.8rem] max-md:flex-col max-md:gap-3"
            style={{ borderTop: "1px solid #3D3A6E", color: "#6E6E94" }}
          >
            <span>© 2026 Quiniela Mundial 2026. Todos los derechos reservados.</span>
            <span>Hecho con 💚 para los fans del fútbol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
