"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/app-layout";
import { Button, Card, CardHeader, CardTitle, Input } from "@/components/ui";
import { mockRules } from "@/components/mock-data";
import type { ScoringRule } from "@/types";

export default function AdminRulesPage() {
  const [rules, setRules] = useState<ScoringRule[]>(mockRules.map((r) => ({ ...r })));
  const [saved, setSaved] = useState(false);

  function updateRule(index: number, field: "points" | "enabled", value: number | boolean) {
    setRules((prev) => {
      const copy = prev.map((r) => ({ ...r }));
      (copy[index] as any)[field] = value;
      return copy;
    });
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <h1 className="text-[1.6rem] font-bold font-display">Reglas de puntuación</h1>
        <Button onClick={handleSave}>{saved ? "✓ Guardado" : "Guardar cambios"}</Button>
      </div>
      <p className="text-fg-secondary mb-6 max-w-[640px]">
        Configura los puntos que se otorgan por cada tipo de predicción y activa o desactiva cada regla.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((rule, i) => (
          <Card key={rule.key}>
            <CardHeader>
              <CardTitle>{rule.label}</CardTitle>
              <label className="flex items-center gap-2 text-[0.85rem] text-fg-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={(e) => updateRule(i, "enabled", e.target.checked)}
                  className="w-4 h-4 accent-green"
                />
                Habilitado
              </label>
            </CardHeader>
            <p className="text-[0.8rem] text-fg-muted font-mono mb-4">#{rule.key}</p>
            <Input
              label="Puntos"
              type="number"
              value={String(rule.points)}
              onChange={(e) => updateRule(i, "points", Number(e.target.value))}
              disabled={!rule.enabled}
            />
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
