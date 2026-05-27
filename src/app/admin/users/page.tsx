"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/app-layout";
import { Button, Card, Input, Badge, EmptyState } from "@/components/ui";
import { mockAdminUsers } from "@/components/mock-data";
import type { AdminUser } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function toggleStatus(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "active" ? ("blocked" as const) : ("active" as const) } : u
      )
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-[1.6rem] font-bold font-display mb-6">Usuarios</h1>

      <div className="mb-6 max-w-md">
        <Input placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="👤" text="No se encontraron usuarios con ese criterio." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-border text-fg-muted text-[0.75rem] uppercase tracking-wider">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">País</th>
                <th className="p-4 font-semibold">Puntos</th>
                <th className="p-4 font-semibold">Predicciones</th>
                <th className="p-4 font-semibold">Grupos</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-bg-primary/40 transition-colors">
                  <td className="p-4 whitespace-nowrap font-medium">{u.name}</td>
                  <td className="p-4 whitespace-nowrap text-fg-secondary">{u.email}</td>
                  <td className="p-4 whitespace-nowrap">{u.country}</td>
                  <td className="p-4 whitespace-nowrap font-mono font-semibold">{u.points}</td>
                  <td className="p-4 whitespace-nowrap">{u.predictionsCount}</td>
                  <td className="p-4 whitespace-nowrap">{u.groupsCount}</td>
                  <td className="p-4 whitespace-nowrap">
                    <Badge variant={u.status === "active" ? "green" : "red"}>
                      {u.status === "active" ? "Activo" : "Bloqueado"}
                    </Badge>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <Button
                      variant={u.status === "active" ? "danger" : "secondary"}
                      size="sm"
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === "active" ? "Bloquear" : "Desbloquear"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </AdminLayout>
  );
}
