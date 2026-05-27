"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/app-layout";
import { Button, Card, CardHeader, CardTitle, ErrorState, Input, SkeletonRows } from "@/components/ui";
import { saveRules, useRules } from "@/lib/hooks";
import type { ScoringRule } from "@/types";

export default function AdminRulesPage() {
  const { data, loading, error, refetch } = useRules();
  const [rules, setRules] = useState<ScoringRule[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setRules(data.rules.map((r) => ({ ...r })));
  }, [data]);

  function updateRule(index: number, field: "points" | "enabled", value: number | boolean) {
    setRules((prev) => {
      const copy = prev.map((r) => ({ ...r }));
      if (field === "points") copy[index].points = value as number;
      else copy[index].enabled = value as boolean;
      return copy;
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveRules(rules.map(({ key, points, enabled }) => ({ key, points, enabled })));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Falló guardar reglas", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <h1 className="text-[1.6rem] font-bold font-display">Reglas de puntuación</h1>
        <Button onClick={handleSave} disabled={loading || saving || rules.length === 0}>
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar cambios"}
        </Button>
      </div>
      <p className="text-fg-secondary mb-6 max-w-[640px]">
        Configura los puntos que se otorgan por cada tipo de predicción y activa o desactiva cada regla.
      </p>

      {loading && <SkeletonRows count={5} />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (
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
      )}
    </AdminLayout>
  );
}
