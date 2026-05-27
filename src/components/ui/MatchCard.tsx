"use client";

import type { Match } from "@/types";
import { Button } from "./Button";

export function MatchCard({
  match,
  onPredict,
  variant = "dark",
}: {
  match: Match;
  onPredict?: () => void;
  variant?: "dark" | "white";
}) {
  const isDark = variant === "dark";
  const bg = isDark
    ? "bg-bg-surface border-border hover:bg-bg-elevated"
    : "bg-bg-white border-border-light text-fg-dark";
  return (
    <div className={`flex items-center gap-4 px-5 py-4 border rounded-radius-lg transition-all duration-150 ${bg}`}>
      <div className="flex items-center gap-3 flex-1">
        <span title={match.homeTeam.name}>{match.homeTeam.flag}</span>
        <span className="font-semibold text-[0.95rem]">{match.homeTeam.name}</span>
        <span className="text-fg-muted text-[0.75rem] font-semibold uppercase tracking-wider hidden md:inline">
          vs
        </span>
        <span title={match.awayTeam.name}>{match.awayTeam.flag}</span>
        <span className="font-semibold text-[0.95rem]">{match.awayTeam.name}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-[0.8rem] text-fg-muted font-medium">{match.date}</span>
        <span className="font-mono text-[0.8rem] text-fg-secondary tabular-nums">{match.time}</span>
        {match.status === "upcoming" && onPredict && (
          <Button size="sm" onClick={onPredict}>
            Predecir
          </Button>
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
