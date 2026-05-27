"use client";

import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold border-none transition-all duration-150 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0";
  const variants: Record<Variant, string> = {
    primary: "bg-green text-white hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_0_20px_oklch(60%_0.18_145/0.2)]",
    secondary: "bg-transparent text-fg border border-border hover:bg-bg-surface hover:border-fg-secondary",
    ghost: "bg-transparent text-fg-secondary hover:bg-bg-surface hover:text-fg",
    danger: "bg-red text-white hover:brightness-110",
  };
  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm rounded-radius-sm",
    md: "px-5 py-2.5 text-[0.95rem] rounded-radius-md",
    lg: "px-8 py-3 text-[1.1rem] rounded-radius-lg",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ className = "", children, ...props }: { className?: string; children: ReactNode;[key: string]: any }) {
  return (
    <div
      className={`bg-bg-surface border border-border rounded-radius-lg p-6 transition-all duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h3 className={`text-[1.05rem] font-semibold text-fg ${className}`}>{children}</h3>;
}

export function Input({
  className = "",
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="mb-5">
      {label && <label className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 bg-bg-primary border border-border rounded-radius-md text-fg text-[0.95rem] outline-none transition-colors duration-150 placeholder:text-fg-muted focus:border-green focus:shadow-[0_0_0_3px_oklch(60%_0.18_145/0.15)] ${error ? "!border-red" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-[0.8rem] text-red mt-1">{error}</p>}
    </div>
  );
}

export function Badge({ variant = "muted", className = "", children }: { variant?: "green" | "gold" | "red" | "blue" | "orange" | "muted"; className?: string; children: ReactNode }) {
  const colors: Record<string, string> = {
    green: "bg-green-bg text-green",
    gold: "bg-gold-bg text-gold",
    red: "bg-red-bg text-red",
    blue: "bg-blue-bg text-blue",
    orange: "bg-orange-bg text-orange",
    muted: "bg-border text-fg-muted",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-radius-full text-[0.7rem] font-semibold uppercase tracking-wider ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-6" onClick={onClose}>
      <div
        className="bg-bg-elevated border border-border rounded-radius-xl w-full max-w-lg p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.2rem] font-bold">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-none border-none text-fg-muted text-[1.2rem] grid place-items-center rounded-radius-sm hover:bg-bg-surface hover:text-fg transition-all duration-150">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 mb-6 flex-wrap">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-5 py-2.5 rounded-radius-md text-[0.9rem] font-medium border-none transition-all duration-150 cursor-pointer ${
            t === active ? "bg-green text-white" : "text-fg-secondary hover:text-fg hover:bg-bg-surface"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function StatCard({ label, value, change, changeUp }: { label: string; value: string | number; change?: string; changeUp?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.8rem] text-fg-muted uppercase tracking-wider font-semibold">{label}</span>
      <span className="text-[2rem] font-bold font-display tracking-tight">{value}</span>
      {change && (
        <span className={`text-[0.8rem] font-semibold flex items-center gap-1 ${changeUp ? "text-green" : "text-red"}`}>
          {changeUp ? "↑" : "↓"} {change}
        </span>
      )}
    </div>
  );
}

export function EmptyState({ icon, text, action }: { icon: string; text: string; action?: ReactNode }) {
  return (
    <div className="text-center py-12 px-6 text-fg-muted">
      <div className="text-[3rem] mb-4 opacity-40">{icon}</div>
      <p className="text-[1rem] mb-6 max-w-[360px] mx-auto">{text}</p>
      {action}
    </div>
  );
}

export function MatchCard({
  match,
  onPredict,
  variant = "dark",
}: {
  match: import("@/types").Match;
  onPredict?: () => void;
  variant?: "dark" | "white";
}) {
  const isDark = variant === "dark";
  const bg = isDark ? "bg-bg-surface border-border hover:bg-bg-elevated" : "bg-bg-white border-border-light text-fg-dark";
  return (
    <div className={`flex items-center gap-4 px-5 py-4 border rounded-radius-lg transition-all duration-150 ${bg}`}>
      <div className="flex items-center gap-3 flex-1">
        <span title={match.homeTeam.name}>{match.homeTeam.flag}</span>
        <span className="font-semibold text-[0.95rem]">{match.homeTeam.name}</span>
        <span className="text-fg-muted text-[0.75rem] font-semibold uppercase tracking-wider hidden md:inline">vs</span>
        <span title={match.awayTeam.name}>{match.awayTeam.flag}</span>
        <span className="font-semibold text-[0.95rem]">{match.awayTeam.name}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-[0.8rem] text-fg-muted font-medium">{match.date}</span>
        <span className="font-mono text-[0.8rem] text-fg-secondary tabular-nums">{match.time}</span>
        {match.status === "upcoming" && onPredict && (
          <Button size="sm" onClick={onPredict}>Predecir</Button>
        )}
        {match.status === "live" && <span className="match-status live">EN VIVO</span>}
        {match.status === "finished" && match.homeScore !== null && (
          <span className="font-display text-[1.3rem] font-bold tracking-wider">
            {match.homeScore}–{match.awayScore}
          </span>
        )}
      </div>
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 items-center flex-wrap mb-6">{children}</div>;
}

export function Select({ options, value, onChange, className = "" }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-bg-surface border border-border text-fg px-4 py-2 rounded-radius-md text-[0.9rem] outline-none min-w-[140px] cursor-pointer ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-bg-primary text-fg">{o.label}</option>
      ))}
    </select>
  );
}
