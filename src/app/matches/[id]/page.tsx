"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/app-layout";
import { Card, Button, Badge } from "@/components/ui";
import { allMatches } from "@/components/mock-data";

function Countdown({ target }: { target: string }) {
  const calcRemaining = useCallback(() => {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, [target]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  const totalSecs = remaining.days * 86400 + remaining.hours * 3600 + remaining.minutes * 60 + remaining.seconds;
  if (totalSecs <= 0) return <span className="text-red font-semibold">Comenzó</span>;

  return (
    <span className="font-mono tabular-nums text-fg-secondary">
      {remaining.days}d {String(remaining.hours).padStart(2, "0")}h {String(remaining.minutes).padStart(2, "0")}m {String(remaining.seconds).padStart(2, "0")}s
    </span>
  );
}

const stageLabels: Record<string, string> = {
  group: "Fase de grupos",
  round_of_16: "Octavos de final",
  quarterfinal: "Cuartos de final",
  semifinal: "Semifinal",
  final: "Final",
  third_place: "Tercer lugar",
};

const statusLabels: Record<string, { label: string; variant: "gold" | "green" | "orange" | "red" }> = {
  exact: { label: "Exacta", variant: "gold" },
  correct: { label: "Acertada", variant: "green" },
  pending: { label: "Pendiente", variant: "orange" },
  incorrect: { label: "Incorrecta", variant: "red" },
};

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const match = allMatches.find((m) => m.id === id);

  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [saved, setSaved] = useState(false);

  if (!match) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-fg-muted">
          <p className="text-[1.2rem]">Partido no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  const isFinished = match.status === "finished";
  const isLocked = !match.isPredictionOpen && !isFinished;
  const prediction = match.userPrediction;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-[640px] mx-auto">
        <div className="text-center mb-2">
          <span className="text-[0.8rem] text-fg-muted font-semibold uppercase tracking-wider">
            {stageLabels[match.stage]} {match.groupName ? `· Grupo ${match.groupName}` : ""}
          </span>
        </div>

        <Card className="text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[3.5rem] leading-none">{match.homeTeam.flag}</span>
              <span className="text-[1.1rem] font-bold">{match.homeTeam.name}</span>
            </div>
            <div className="text-fg-muted text-[1.5rem] font-display font-bold">VS</div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[3.5rem] leading-none">{match.awayTeam.flag}</span>
              <span className="text-[1.1rem] font-bold">{match.awayTeam.name}</span>
            </div>
          </div>

          {isFinished ? (
            <div className="mb-6">
              <div className="text-[3rem] font-bold font-display tracking-wider mb-2">
                {match.homeScore} – {match.awayScore}
              </div>
              {prediction && (
                <div className="inline-flex items-center gap-2 bg-bg-primary px-4 py-2 rounded-radius-md">
                  <span className="text-fg-secondary text-[0.9rem]">
                    Tu predicción: {prediction.homeScore}–{prediction.awayScore}
                  </span>
                  <Badge variant={statusLabels[prediction.status].variant}>
                    {statusLabels[prediction.status].label}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  disabled={isLocked}
                  placeholder="0"
                  className="w-20 h-20 bg-bg-primary border-2 border-border rounded-radius-lg text-center text-[2rem] font-bold font-display text-fg outline-none focus:border-green disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[1.5rem] text-fg-muted font-bold">:</span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  disabled={isLocked}
                  placeholder="0"
                  className="w-20 h-20 bg-bg-primary border-2 border-border rounded-radius-lg text-center text-[2rem] font-bold font-display text-fg outline-none focus:border-green disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              {isLocked ? (
                <p className="text-orange font-semibold">⏰ La predicción para este partido está cerrada</p>
              ) : (
                <Button size="lg" onClick={handleSave}>
                  {saved ? "✓ Guardado" : "Guardar predicción"}
                </Button>
              )}
            </div>
          )}

          <div className="border-t border-border pt-4 mt-2 space-y-2">
            <div className="flex items-center justify-center gap-6 text-[0.9rem] text-fg-secondary flex-wrap">
              <span>📅 {match.date}</span>
              <span>⏰ {match.time}</span>
              {!isFinished && (
                <span className="flex items-center gap-1">
                  🕐 <Countdown target={match.predictionDeadline} />
                </span>
              )}
            </div>
            <div className="text-[0.85rem] text-fg-muted">🏟️ {match.stadium}</div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
