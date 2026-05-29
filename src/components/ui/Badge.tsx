import { type ReactNode } from "react";

export type BadgeVariant =
  | "green"
  | "gold"
  | "red"
  | "blue"
  | "orange"
  | "violet"
  | "magenta"
  | "muted";

const colors: Record<BadgeVariant, string> = {
  green: "bg-green-bg text-green",
  gold: "bg-gold-bg text-gold",
  red: "bg-red-bg text-red",
  blue: "bg-blue-bg text-blue",
  orange: "bg-orange-bg text-orange",
  violet: "bg-violet-bg text-violet",
  magenta: "bg-magenta-bg text-magenta",
  muted: "bg-border text-fg-muted",
};

export function Badge({
  variant = "muted",
  className = "",
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-radius-full text-[0.7rem] font-semibold uppercase tracking-wider ${colors[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
