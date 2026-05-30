"use client";

import { useState } from "react";
import Link from "next/link";
import type { Match } from "@/types";
import { Button } from "./Button";
import { Flag } from "./Flag";

export function MatchCard({
  match,
  onSavePrediction,
  variant = "dark",
}: {
  match: Match;
  onSavePrediction?: (homeScore: number, awayScore: number) => Promise<void> | void;
  variant?: "dark" | "white";
}) {
  const initialHome = match.userPrediction?.homeScore?.toString() ?? "";
  const initialAway = match.userPrediction?.awayScore?.toString() ?? "";

  const [editing, setEditing] = useState(false);
  const [homeScore, setHomeScore] = useState(initialHome);
  const [awayScore, setAwayScore] = useState(initialAway);
  const [saving, setSaving] = useState(false);

  const isDark = variant === "dark";
  const bg = isDark
    ? "bg-bg-surface border-border hover:bg-bg-elevated"
    : "bg-bg-white border-border-light text-fg-dark";

  const canEdit = match.status === "upcoming" && match.isPredictionOpen && !!onSavePrediction;
  const hasPrediction = !!match.userPrediction;

  const handleSave = async () => {
    if (homeScore === "" || awayScore === "" || !onSavePrediction) return;
    setSaving(true);
    try {
      await onSavePrediction(Number(homeScore), Number(awayScore));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setHomeScore(initialHome);
    setAwayScore(initialAway);
    setEditing(false);
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 px-5 py-4 border rounded-radius-lg transition-all duration-150 ${bg}`}
    >
      <Link
        href={`/matches/${match.id}`}
        className="flex items-center gap-3 flex-1 min-w-0 no-underline text-inherit hover:opacity-90"
      >
        <Flag code={match.homeTeam.code} name={match.homeTeam.name} className="h-6 w-auto" />
        <span className="font-semibold text-[0.95rem] truncate">{match.homeTeam.name}</span>
        <span className="text-fg-muted text-[0.75rem] font-semibold uppercase tracking-wider hidden md:inline">
          vs
        </span>
        <Flag code={match.awayTeam.code} name={match.awayTeam.name} className="h-6 w-auto" />
        <span className="font-semibold text-[0.95rem] truncate">{match.awayTeam.name}</span>
      </Link>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[0.8rem] text-fg-muted font-medium">{match.date}</span>
          <span className="font-mono text-[0.8rem] text-fg-secondary tabular-nums">{match.time}</span>
        </div>

        {match.status === "live" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-bg text-green text-[0.7rem] font-bold uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            EN VIVO
          </span>
        )}

        {match.status === "finished" && match.homeScore !== null && (
          <span className="font-display text-[1.3rem] font-bold tracking-wider">
            {match.homeScore}–{match.awayScore}
          </span>
        )}

        {match.status === "upcoming" && !canEdit && hasPrediction && match.userPrediction && (
          <span className="text-[0.85rem] text-fg-secondary font-mono tabular-nums">
            Predicho {match.userPrediction.homeScore}–{match.userPrediction.awayScore}
          </span>
        )}

        {canEdit && !editing && hasPrediction && match.userPrediction && (
          <>
            <span className="text-[0.85rem] text-fg-secondary font-mono tabular-nums">
              Predicho {match.userPrediction.homeScore}–{match.userPrediction.awayScore}
            </span>
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              Editar
            </Button>
          </>
        )}

        {canEdit && !editing && !hasPrediction && (
          <Button size="sm" onClick={() => setEditing(true)}>
            Predecir
          </Button>
        )}

        {canEdit && editing && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={99}
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              aria-label={`Goles ${match.homeTeam.name}`}
              className="w-12 h-9 bg-bg-primary border border-border rounded-radius-sm text-center font-mono text-fg outline-none focus:border-green [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-fg-muted">:</span>
            <input
              type="number"
              min={0}
              max={99}
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              aria-label={`Goles ${match.awayTeam.name}`}
              className="w-12 h-9 bg-bg-primary border border-border rounded-radius-sm text-center font-mono text-fg outline-none focus:border-green [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || homeScore === "" || awayScore === ""}
            >
              {saving ? "..." : "Guardar"}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} disabled={saving}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
