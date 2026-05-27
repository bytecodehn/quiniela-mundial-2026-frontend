"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/app-layout";
import { Card, Input, EmptyState } from "@/components/ui";
import { mockAdminGroups } from "@/components/mock-data";

export default function AdminGroupsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockAdminGroups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.inviteCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-[1.6rem] font-bold font-display mb-6">Grupos</h1>

      <div className="mb-6 max-w-md">
        <Input placeholder="Buscar por nombre o código..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="👥" text="No se encontraron grupos con ese criterio." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-[0.9rem]">
            <thead>
              <tr className="border-b border-border text-fg-muted text-[0.75rem] uppercase tracking-wider">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Código</th>
                <th className="p-4 font-semibold">Miembros</th>
                <th className="p-4 font-semibold">Creado por</th>
                <th className="p-4 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-border last:border-b-0 hover:bg-bg-primary/40 transition-colors">
                  <td className="p-4 whitespace-nowrap font-medium">{g.name}</td>
                  <td className="p-4 whitespace-nowrap font-mono text-fg-secondary">{g.inviteCode}</td>
                  <td className="p-4 whitespace-nowrap">{g.memberCount}</td>
                  <td className="p-4 whitespace-nowrap text-fg-secondary">{g.createdBy}</td>
                  <td className="p-4 whitespace-nowrap text-fg-muted">{new Date(g.createdAt).toLocaleDateString("es-ES")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </AdminLayout>
  );
}
