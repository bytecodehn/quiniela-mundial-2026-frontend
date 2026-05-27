"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Button, Card, CardTitle, CardHeader, Badge, Modal, Input, EmptyState } from "@/components/ui";
import { mockGroups } from "@/components/mock-data";

export default function GroupsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleCreate = () => {
    if (!createName.trim()) return;
    setShowCreate(false);
    setCreateName("");
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    setShowJoin(false);
    setJoinCode("");
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[1.8rem] font-display font-bold text-fg">Mis Grupos</h1>
          <p className="text-fg-secondary text-[0.95rem] mt-1">
            Crea o únete a grupos y compite con tus amigos
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowCreate(true)}>Crear grupo</Button>
          <Button onClick={() => setShowJoin(true)}>Unirse a grupo</Button>
        </div>
      </div>

      {mockGroups.length === 0 ? (
        <EmptyState
          icon="👥"
          text="No estás en ningún grupo todavía. Crea uno nuevo o únete con un código de invitación."
          action={
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowCreate(true)}>Crear grupo</Button>
              <Button onClick={() => setShowJoin(true)}>Unirse a grupo</Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mockGroups.map((g) => (
            <Link key={g.id} href={`/groups/${g.id}`} className="no-underline">
              <Card className="h-full hover:bg-bg-elevated hover:border-green transition-all duration-150 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-[1.3rem]">👥</span>
                    <CardTitle>{g.name}</CardTitle>
                  </div>
                  <Badge variant="gold" className="tabular-nums">#{g.myRank}</Badge>
                </CardHeader>
                <div className="space-y-2 text-[0.9rem]">
                  <div className="flex justify-between text-fg-secondary">
                    <span>Miembros</span>
                    <span className="font-semibold text-fg">{g.memberCount}</span>
                  </div>
                  <div className="flex justify-between text-fg-secondary">
                    <span>Mis puntos</span>
                    <span className="font-semibold text-fg">{g.myPoints}</span>
                  </div>
                  <div className="flex justify-between text-fg-secondary">
                    <span>Código</span>
                    <span className="font-mono text-fg-muted text-[0.8rem]">{g.inviteCode}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Crear grupo">
        <Input
          label="Nombre del grupo"
          placeholder="Ej: Los Crack del 26"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
          <Button onClick={handleCreate} disabled={!createName.trim()}>Crear</Button>
        </div>
      </Modal>

      <Modal open={showJoin} onClose={() => setShowJoin(false)} title="Unirse a un grupo">
        <Input
          label="Código de invitación"
          placeholder="Ej: CRACK26"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={() => setShowJoin(false)}>Cancelar</Button>
          <Button onClick={handleJoin} disabled={!joinCode.trim()}>Unirse</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
