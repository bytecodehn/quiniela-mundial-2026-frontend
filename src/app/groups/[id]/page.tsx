"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button, Card, Badge } from "@/components/ui";
import { mockGroupDetail, mockUser } from "@/components/mock-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GroupDetailPage() {
  const group = mockGroupDetail;
  const currentUserId = mockUser.id;
  const [copied, setCopied] = useState(false);

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  };

  return (
    <AppLayout>
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[1.5rem]">👥</span>
              <h1 className="text-[1.8rem] font-display font-bold text-fg">{group.name}</h1>
            </div>
            <div className="flex items-center gap-4 text-[0.85rem] text-fg-secondary mt-1">
              <span>{group.memberCount} miembros</span>
              <span>Creado {formatDate(group.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-bg-primary border border-border rounded-radius-md px-4 py-2 flex items-center gap-3">
              <span className="text-fg-muted text-[0.75rem] font-semibold uppercase tracking-wider">Código</span>
              <span className="font-mono font-bold text-[1rem] tracking-wider text-gold">{group.inviteCode}</span>
              <button
                onClick={copyInviteCode}
                className="bg-none border-none text-fg-secondary hover:text-fg cursor-pointer transition-colors text-[1rem]"
                title="Copiar código"
              >
                {copied ? "✅" : "📋"}
              </button>
            </div>
            <Button variant="secondary" onClick={copyInviteCode}>
              {copied ? "¡Copiado!" : "Invitar amigos"}
            </Button>
          </div>
        </div>
      </Card>

      <h2 className="text-[1.2rem] font-bold text-fg mb-4">Ranking del grupo</h2>
      <Card className="overflow-hidden !p-0 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[0.75rem] text-fg-muted uppercase tracking-wider font-semibold border-b border-border">
                <th className="p-4 w-16">#</th>
                <th className="p-4">Participante</th>
                <th className="p-4 text-right">Puntos</th>
                <th className="p-4 text-right hidden md:table-cell">Aciertos</th>
                <th className="p-4 text-right hidden sm:table-cell">Se unió</th>
              </tr>
            </thead>
            <tbody>
              {group.members.map((m) => {
                const isMe = m.userId === currentUserId;
                return (
                  <tr
                    key={m.userId}
                    className={`border-b border-border transition-colors duration-150 ${
                      isMe ? "bg-green-bg/20 border-l-2 border-l-green" : "hover:bg-bg-elevated"
                    }`}
                  >
                    <td className="p-4 font-bold text-[0.95rem] tabular-nums">{m.rank}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green to-cyan grid place-items-center text-white font-bold text-[0.75rem] shrink-0">
                          {m.avatar}
                        </div>
                        <div>
                          <span className="font-semibold text-[0.9rem]">{m.name}</span>
                          {isMe && <Badge variant="green" className="ml-2">Tú</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-[1rem] tabular-nums">{m.points}</td>
                    <td className="p-4 text-right text-fg-secondary text-[0.9rem] hidden md:table-cell tabular-nums">
                      {m.points >= 250 ? `${Math.round(m.points / 6)}` : `${Math.round(m.points / 7)}`}
                    </td>
                    <td className="p-4 text-right text-fg-muted text-[0.8rem] hidden sm:table-cell">{formatDate(m.joinedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 className="text-[1.2rem] font-bold text-fg mb-4">Miembros</h2>
      <div className="flex flex-wrap gap-3">
        {group.members.map((m) => (
          <div
            key={m.userId}
            className="flex items-center gap-2 bg-bg-surface border border-border rounded-radius-md px-4 py-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green to-cyan grid place-items-center text-white font-bold text-[0.75rem] shrink-0">
              {m.avatar}
            </div>
            <div>
              <div className="text-[0.85rem] font-semibold text-fg">{m.name}</div>
              <div className="text-[0.7rem] text-fg-muted">#{m.rank} · {m.points} pts</div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
