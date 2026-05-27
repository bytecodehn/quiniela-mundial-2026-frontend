"use client";

import { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Badge, Button, Card, CardHeader, CardTitle, EmptyState, ErrorState, Input, Modal, SkeletonRows, useToast } from "@/components/ui";
import { createGroup, joinGroup, useGroups } from "@/lib/hooks";

export default function GroupsPage() {
  const { data, loading, error, refetch } = useGroups();
  const toast = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const groups = data?.groups ?? [];

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setSubmitting(true);
    try {
      const res = await createGroup({ name: createName.trim() });
      await refetch();
      setShowCreate(false);
      setCreateName("");
      toast.success(`Grupo "${res.group.name}" creado`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(`No se pudo crear el grupo: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setSubmitting(true);
    try {
      const res = await joinGroup({ inviteCode: joinCode.trim() });
      await refetch();
      setShowJoin(false);
      setJoinCode("");
      toast.success(`Te uniste a "${res.group.name}"`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      toast.error(`No se pudo unir al grupo: ${msg}`);
    } finally {
      setSubmitting(false);
    }
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

      {loading && <SkeletonRows count={3} />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && groups.length === 0 && (
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
      )}

      {!loading && !error && groups.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <Link key={g.id} href={`/groups/${g.id}`} className="no-underline">
              <Card className="h-full hover:bg-bg-elevated hover:border-green transition-all duration-150 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-[1.3rem]">👥</span>
                    <CardTitle>{g.name}</CardTitle>
                  </div>
                  {g.myRank !== null && <Badge variant="gold" className="tabular-nums">#{g.myRank}</Badge>}
                </CardHeader>
                <div className="space-y-2 text-[0.9rem]">
                  <div className="flex justify-between text-fg-secondary">
                    <span>Miembros</span>
                    <span className="font-semibold text-fg">{g.memberCount}</span>
                  </div>
                  <div className="flex justify-between text-fg-secondary">
                    <span>Mis puntos</span>
                    <span className="font-semibold text-fg">{g.myPoints ?? 0}</span>
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
          <Button onClick={handleCreate} disabled={!createName.trim() || submitting}>
            {submitting ? "Creando..." : "Crear"}
          </Button>
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
          <Button onClick={handleJoin} disabled={!joinCode.trim() || submitting}>
            {submitting ? "Uniéndote..." : "Unirse"}
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
