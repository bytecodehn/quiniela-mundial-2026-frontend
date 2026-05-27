"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function useNavItems() {
  const t = useT();
  const items = [
    { href: "/dashboard", label: t.nav.dashboard, icon: "📊" },
    { href: "/matches", label: t.nav.matches, icon: "⚽" },
    { href: "/predictions", label: t.nav.predictions, icon: "🎯" },
    { href: "/leaderboard", label: t.nav.leaderboard, icon: "🏆" },
    { href: "/groups", label: t.nav.groups, icon: "👥" },
  ];
  return items;
}

function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const t = useT();
  const navItems = useNavItems();

  return (
    <aside className="w-[260px] bg-bg-primary border-r border-border flex flex-col fixed top-0 left-0 bottom-0 z-[100] overflow-y-auto max-md:hidden">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 bg-gradient-to-br from-green to-cyan rounded-radius-md grid place-items-center text-[1.2rem] font-extrabold text-white shrink-0">
          Q
        </div>
        <span className="font-display font-bold text-[1.1rem]">Quiniela 2026</span>
      </div>

      <nav className="p-4 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-radius-md text-[0.95rem] font-medium transition-all duration-150 mb-0.5 ${
                active ? "bg-green text-white" : "text-fg-secondary hover:bg-bg-surface hover:text-fg"
              }`}
            >
              <span className="w-5 text-center text-[1.1rem]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-3 rounded-radius-md cursor-pointer transition-colors duration-150 hover:bg-bg-surface"
        >
          <div className="w-9 h-9 rounded-radius-full bg-gradient-to-br from-green to-cyan grid place-items-center font-bold text-[0.9rem] text-white shrink-0">
            {user?.avatar || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[0.9rem] font-semibold text-fg truncate">{user?.name || "Usuario"}</div>
            <div className="text-[0.75rem] text-fg-muted capitalize">{user?.role === "admin" ? "Admin" : "Jugador"}</div>
          </div>
        </Link>
        <button
          onClick={logout}
          className="mt-2 w-full text-left px-3 py-2 text-[0.85rem] text-fg-muted hover:text-red transition-colors rounded-radius-md hover:bg-bg-surface border-none cursor-pointer"
        >
          {t.nav.logout}
        </button>
        <div className="mt-3 pt-3 border-t border-border">
          <LanguageSwitcher className="w-full" />
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const mobileNavItems = useNavItems();
  return (
    <nav className="hidden max-md:flex fixed bottom-0 left-0 right-0 h-16 bg-bg-primary border-t border-border z-[100] px-2 justify-around items-center">
      {mobileNavItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[0.65rem] font-medium rounded-radius-md transition-all duration-150 cursor-pointer border-none bg-none min-w-[56px] ${
              active ? "text-green" : "text-fg-muted hover:text-fg-secondary"
            }`}
          >
            <span className="text-[1.3rem] leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const t = useT();
  const navItems = useNavItems();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] max-md:ml-0 flex flex-col min-h-screen">
        <header className="h-16 bg-bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-50 max-md:px-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={mobileMenuOpen}
              className="hidden max-md:flex w-8 h-8 items-center justify-center text-fg-secondary text-[1.2rem] border-none cursor-pointer bg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
            {user && (
              <span className="text-[0.95rem] text-fg-secondary">
                {t.auth.welcome}, <strong className="text-fg">{user.name.split(" ")[0]}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 max-md:hidden">
            <div className="flex items-center gap-2 bg-bg-primary border border-border rounded-radius-md px-4 py-2 min-w-[240px]">
              <span className="text-fg-muted text-[0.85rem]" aria-hidden="true">🔍</span>
              <input
                type="search"
                aria-label="Buscar partidos o grupos"
                placeholder="Buscar partidos, grupos..."
                className="bg-none border-none text-fg outline-none w-full text-[0.9rem] placeholder:text-fg-muted"
              />
            </div>
            <button
              type="button"
              aria-label="Notificaciones (1 nueva)"
              className="w-8 h-8 bg-bg-primary border border-border rounded-radius-md grid place-items-center text-fg-secondary text-[1.1rem] border-none transition-all duration-150 cursor-pointer relative"
            >
              <span aria-hidden="true">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full border-2 border-bg-surface" />
            </button>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                aria-label="Panel de administración"
                className="w-8 h-8 bg-bg-primary border border-border rounded-radius-md grid place-items-center text-fg-secondary text-[0.9rem] transition-all duration-150 hover:bg-bg-surface hover:text-fg no-underline"
              >
                <span aria-hidden="true">⚙️</span>
              </Link>
            )}
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="hidden max-md:flex flex-col bg-bg-elevated border-b border-border p-4 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-radius-md text-[0.95rem] text-fg-secondary hover:bg-bg-surface hover:text-fg transition-colors no-underline"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-radius-md text-[0.95rem] text-fg-secondary hover:bg-bg-surface hover:text-fg transition-colors no-underline">
                👤 Perfil
              </Link>
              {user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-radius-md text-[0.95rem] text-fg-secondary hover:bg-bg-surface hover:text-fg transition-colors no-underline">
                  ⚙️ Admin
                </Link>
              )}
            </div>
          </div>
        )}

        <main className="flex-1 p-8 max-md:p-4 max-md:pb-20 max-w-[1280px] w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const adminNav = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/matches", label: "Partidos", icon: "⚽" },
    { href: "/admin/users", label: "Usuarios", icon: "👤" },
    { href: "/admin/rules", label: "Reglas", icon: "📋" },
    { href: "/admin/groups", label: "Grupos", icon: "👥" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-[260px] bg-bg-primary border-r border-border flex flex-col fixed top-0 left-0 bottom-0 z-[100] overflow-y-auto max-md:hidden">
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="w-9 h-9 bg-gradient-to-br from-green to-cyan rounded-radius-md grid place-items-center text-[1.2rem] font-extrabold text-white shrink-0">
            A
          </div>
          <div>
            <div className="font-display font-bold text-[0.95rem]">Admin</div>
            <div className="text-[0.7rem] text-fg-muted">Quiniela 2026</div>
          </div>
        </div>
        <nav className="p-4 flex-1">
          {adminNav.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-radius-md text-[0.95rem] font-medium transition-all duration-150 mb-0.5 ${
                  active ? "bg-green text-white" : "text-fg-secondary hover:bg-bg-surface hover:text-fg"
                }`}
              >
                <span className="w-5 text-center text-[1.1rem]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 ml-[260px] max-md:ml-0 flex flex-col min-h-screen">
        <header className="h-16 bg-bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-50 max-md:px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-fg-secondary hover:text-fg text-[0.9rem] no-underline transition-colors">
              ← Volver al sitio
            </Link>
          </div>
          <div className="text-[0.85rem] text-fg-muted">Panel de administración</div>
        </header>
        <main className="flex-1 p-8 max-md:p-4 max-md:pb-20 max-w-[1280px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
