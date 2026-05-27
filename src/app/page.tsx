"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, MatchCard } from "@/components/ui";
import { mockMatches, mockLeaderboard, mockAdminStats } from "@/components/mock-data";

const navLinks = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#partidos", label: "Partidos" },
  { href: "#ranking", label: "Ranking" },
];

const features = [
  { icon: "🎯", title: "Predicciones", desc: "Pronosticá el resultado de cada partido del Mundial 2026. Sumá puntos por cada acierto." },
  { icon: "🏆", title: "Rankings globales", desc: "Competí contra miles de usuarios. Escalá posiciones y demostrá quién sabe más de fútbol." },
  { icon: "👥", title: "Grupos privados", desc: "Creá grupos con amigos, familia o compañeros de trabajo. Cada grupo tiene su propio ranking." },
  { icon: "📊", title: "Estadísticas", desc: "Seguí tu rendimiento en detalle. Aciertos exactos, rachas, porcentaje y más métricas." },
];

const steps = [
  { number: "01", title: "Registrate", desc: "Creá tu cuenta gratis en menos de un minuto. Solo necesitás un email." },
  { number: "02", title: "Pronosticá", desc: "Elegí el marcador de cada partido antes de que comience. Cuanto más exacto, más puntos." },
  { number: "03", title: "Ganá puntos", desc: "Acumulá puntos por cada predicción correcta. Competí en el ranking global y en grupos." },
];

const countries = [
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Brasil", flag: "🇧🇷" },
  { name: "Francia", flag: "🇫🇷" },
  { name: "Alemania", flag: "🇩🇪" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const top3 = mockLeaderboard.slice(0, 3);
  const upcoming = mockMatches.filter((m) => m.status === "upcoming").slice(0, 4);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-green to-cyan rounded-radius-md grid place-items-center text-[1.2rem] font-extrabold text-white">
              Q
            </div>
            <span className="font-display font-bold text-[1.1rem] text-fg max-md:hidden">Quiniela 2026</span>
          </Link>

          <nav className="flex items-center gap-1 max-md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[0.9rem] text-fg-secondary hover:text-fg rounded-radius-md transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/register" className="max-md:hidden">
              <Button size="sm">Registrarse</Button>
            </Link>
            <button
              className="hidden max-md:flex w-8 h-8 items-center justify-center text-fg-secondary text-[1.4rem] border-none cursor-pointer bg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="max-md:flex flex-col bg-bg-elevated border-b border-border p-4 gap-1 hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-[0.95rem] text-fg-secondary hover:text-fg rounded-radius-md transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full mt-2">Registrarse</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(35%_0.1_85/0.15),transparent_70%)] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 pt-20 pb-24 max-md:pt-12 max-md:pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 bg-green-bg/50 border border-green/20 rounded-radius-full px-4 py-1.5 text-[0.8rem] text-green font-semibold mb-8">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
            Mundial 2026 · Ya disponible
          </div>

          <h1 className="text-[4rem] max-md:text-[2.5rem] leading-[1.05] font-extrabold font-display tracking-tight mb-6 max-w-[800px] mx-auto">
            <span className="bg-gradient-to-r from-green via-cyan to-gold bg-clip-text text-transparent">
              Pronosticá el Mundial 2026
            </span>
          </h1>

          <p className="text-[1.2rem] max-md:text-[1rem] text-fg-secondary max-w-[600px] mx-auto mb-10 leading-relaxed">
            Competí con amigos y miles de usuarios. Predecí resultados, sumá puntos y demostrá que sos el que más sabe de fútbol.
          </p>

          <div className="flex items-center justify-center gap-4 max-md:flex-col">
            <Link href="/register">
              <Button size="lg" className="text-[1.1rem] px-10">Registrarme gratis</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">Iniciar sesión</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-[600px] mx-auto mt-16 max-md:gap-4">
            <div>
              <div className="text-[2.2rem] max-md:text-[1.8rem] font-extrabold font-display text-fg">50K+</div>
              <div className="text-[0.8rem] text-fg-muted font-medium uppercase tracking-wider">Usuarios</div>
            </div>
            <div>
              <div className="text-[2.2rem] max-md:text-[1.8rem] font-extrabold font-display text-fg">64</div>
              <div className="text-[0.8rem] text-fg-muted font-medium uppercase tracking-wider">Partidos</div>
            </div>
            <div>
              <div className="text-[2.2rem] max-md:text-[1.8rem] font-extrabold font-display text-gold">{mockLeaderboard[0].points}</div>
              <div className="text-[0.8rem] text-fg-muted font-medium uppercase tracking-wider">Puntos récord</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-12">
          <div className="text-center mb-14">
            <span className="text-[0.8rem] text-green font-semibold uppercase tracking-widest">Cómo funciona</span>
            <h2 className="text-[2.5rem] max-md:text-[1.8rem] font-bold font-display mt-3">Tres pasos simples</h2>
          </div>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8 max-md:gap-6">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-radius-xl bg-gradient-to-br from-green/20 to-cyan/20 border border-green/20 grid place-items-center text-[1.4rem] font-bold text-green font-display">
                  {step.number}
                </div>
                <h3 className="text-[1.2rem] font-bold text-fg mb-3">{step.title}</h3>
                <p className="text-[0.95rem] text-fg-secondary leading-relaxed max-w-[320px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-bg-surface/50">
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-12">
          <div className="text-center mb-14">
            <span className="text-[0.8rem] text-green font-semibold uppercase tracking-widest">Características</span>
            <h2 className="text-[2.5rem] max-md:text-[1.8rem] font-bold font-display mt-3">Todo lo que necesitás</h2>
          </div>

          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="text-center hover:border-green/30 hover:-translate-y-1 transition-all duration-300">
                <div className="text-[2.5rem] mb-4">{f.icon}</div>
                <h3 className="text-[1.05rem] font-bold text-fg mb-3">{f.title}</h3>
                <p className="text-[0.85rem] text-fg-secondary leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Matches Preview */}
      <section id="partidos" className="border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[0.8rem] text-green font-semibold uppercase tracking-widest">Próximos partidos</span>
              <h2 className="text-[2.5rem] max-md:text-[1.8rem] font-bold font-display mt-3">Pronosticá ahora</h2>
            </div>
            <Link href="/matches" className="max-md:hidden">
              <Button variant="ghost" size="sm">Ver todos →</Button>
            </Link>
          </div>

          <div className="grid gap-3">
            {upcoming.map((match) => (
              <MatchCard key={match.id} match={match} variant="dark" />
            ))}
          </div>

          <Link href="/matches" className="md:hidden mt-6 block text-center">
            <Button variant="secondary" className="w-full">Ver todos los partidos</Button>
          </Link>
        </div>
      </section>

      {/* Rankings Preview */}
      <section id="ranking" className="border-t border-border bg-bg-surface/50">
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-12">
          <div className="text-center mb-14">
            <span className="text-[0.8rem] text-green font-semibold uppercase tracking-widest">Ranking global</span>
            <h2 className="text-[2.5rem] max-md:text-[1.8rem] font-bold font-display mt-3">Los mejores del mundo</h2>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center gap-4 max-md:gap-2 max-w-[700px] mx-auto">
            {/* 2nd place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-14 h-14 max-md:w-10 max-md:h-10 rounded-radius-full bg-gradient-to-br from-fg-muted to-border grid place-items-center font-bold text-[1rem] max-md:text-[0.8rem] text-fg mb-2">
                {top3[1].avatar}
              </div>
              <div className="text-[0.85rem] max-md:text-[0.75rem] font-semibold text-fg text-center truncate max-w-[120px]">{top3[1].name}</div>
              <div className="text-[0.75rem] text-fg-muted font-medium">{top3[1].points} pts</div>
              <div className="mt-2 w-full h-[100px] max-md:h-[70px] bg-bg-surface border border-border rounded-t-radius-lg flex items-center justify-center">
                <span className="text-[1.8rem] max-md:text-[1.3rem] font-extrabold text-fg-muted">2</span>
              </div>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                <div className="w-16 h-16 max-md:w-12 max-md:h-12 rounded-radius-full bg-gradient-to-br from-gold to-yellow-400 grid place-items-center font-bold text-[1.1rem] max-md:text-[0.9rem] text-black mb-2 ring-2 ring-gold/30">
                  {top3[0].avatar}
                </div>
                <div className="absolute -top-1 -right-1 text-[1.2rem]">👑</div>
              </div>
              <div className="text-[0.9rem] max-md:text-[0.8rem] font-bold text-fg text-center truncate max-w-[120px]">{top3[0].name}</div>
              <div className="text-[0.8rem] max-md:text-[0.7rem] text-gold font-bold">{top3[0].points} pts</div>
              <div className="mt-2 w-full h-[130px] max-md:h-[90px] bg-gold-bg/20 border border-gold/30 rounded-t-radius-lg flex items-center justify-center">
                <span className="text-[2.2rem] max-md:text-[1.6rem] font-extrabold text-gold">1</span>
              </div>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-14 h-14 max-md:w-10 max-md:h-10 rounded-radius-full bg-gradient-to-br from-orange/40 to-border grid place-items-center font-bold text-[1rem] max-md:text-[0.8rem] text-fg mb-2">
                {top3[2].avatar}
              </div>
              <div className="text-[0.85rem] max-md:text-[0.75rem] font-semibold text-fg text-center truncate max-w-[120px]">{top3[2].name}</div>
              <div className="text-[0.75rem] text-fg-muted font-medium">{top3[2].points} pts</div>
              <div className="mt-2 w-full h-[80px] max-md:h-[55px] bg-bg-surface border border-border rounded-t-radius-lg flex items-center justify-center">
                <span className="text-[1.5rem] max-md:text-[1.1rem] font-extrabold text-fg-muted">3</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/register">
              <Button variant="secondary">Ver ranking completo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-20 max-md:py-12 text-center">
          <h2 className="text-[2.5rem] max-md:text-[1.8rem] font-bold font-display mb-4">¿Listo para el desafío?</h2>
          <p className="text-[1.1rem] text-fg-secondary max-w-[500px] mx-auto mb-8">
            Unite a <strong className="text-fg">{mockAdminStats.totalUsers.toLocaleString()}</strong> usuarios que ya están pronosticando.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-[1.1rem] px-10">Comenzá ahora</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-surface/30">
        <div className="max-w-[1280px] mx-auto px-6 py-12 max-md:py-8">
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-8 mb-10">
            <div className="max-md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green to-cyan rounded-radius-md grid place-items-center text-[1rem] font-extrabold text-white">
                  Q
                </div>
                <span className="font-display font-bold text-[1rem] text-fg">Quiniela 2026</span>
              </div>
              <p className="text-[0.85rem] text-fg-muted leading-relaxed max-w-[260px]">La plataforma de predicciones del Mundial 2026. Competí, divertite y demostrá tu conocimiento.</p>
            </div>
            <div>
              <h4 className="text-[0.75rem] font-semibold text-fg-muted uppercase tracking-widest mb-4">Plataforma</h4>
              <div className="flex flex-col gap-2">
                <Link href="/login" className="text-[0.9rem] text-fg-secondary hover:text-fg transition-colors no-underline">Iniciar sesión</Link>
                <Link href="/register" className="text-[0.9rem] text-fg-secondary hover:text-fg transition-colors no-underline">Registrarse</Link>
                <Link href="/matches" className="text-[0.9rem] text-fg-secondary hover:text-fg transition-colors no-underline">Partidos</Link>
                <Link href="/leaderboard" className="text-[0.9rem] text-fg-secondary hover:text-fg transition-colors no-underline">Ranking</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[0.75rem] font-semibold text-fg-muted uppercase tracking-widest mb-4">Comunidad</h4>
              <div className="flex flex-col gap-2">
                <Link href="/groups" className="text-[0.9rem] text-fg-secondary hover:text-fg transition-colors no-underline">Grupos</Link>
                <span className="text-[0.9rem] text-fg-muted">Foro (pronto)</span>
                <span className="text-[0.9rem] text-fg-muted">Blog (pronto)</span>
              </div>
            </div>
            <div>
              <h4 className="text-[0.75rem] font-semibold text-fg-muted uppercase tracking-widest mb-4">Legal</h4>
              <div className="flex flex-col gap-2">
                <span className="text-[0.9rem] text-fg-muted">Términos y condiciones</span>
                <span className="text-[0.9rem] text-fg-muted">Política de privacidad</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-[0.8rem] text-fg-muted">
            © 2026 Quiniela Mundial 2026. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
