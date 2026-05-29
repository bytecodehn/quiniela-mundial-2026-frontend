"use client";

// Contexto de "grupo activo" (F4/F5).
//
// Guarda el grupo en el que el usuario está "parado" actualmente: predicciones,
// leaderboard y stats per-grupo se leen respecto a este grupo. El id se
// persiste en localStorage (key `qm26-active-group`) para sobrevivir reloads.
//
// La lista de grupos se obtiene del hook `useGroups`, que ya respeta el flag
// USE_MOCKS_GROUPS y el backend real /groups/mine. Al cargar, si no hay un id
// persistido válido, se toma por defecto el PRIMER grupo del usuario.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useGroups } from "./hooks";
import { useAuth } from "./auth";
import type { Group } from "@/types";

const STORAGE_KEY = "qm26-active-group";

interface ActiveGroupContextType {
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
  groups: Group[];
  loading: boolean;
}

const ActiveGroupContext = createContext<ActiveGroupContextType | null>(null);

function readStored(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function ActiveGroupProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // useGroups gatea por USE_MOCKS_GROUPS y golpea /groups/mine en real. Solo
  // tiene sentido cuando hay sesión; sin usuario, data queda vacía/erroreada y
  // lo tratamos como "sin grupos".
  const { data, loading } = useGroups();
  const groups = useMemo<Group[]>(() => (user ? data?.groups ?? [] : []), [user, data]);

  const [activeGroupId, setActiveGroupIdState] = useState<string | null>(null);

  // Hidrata desde localStorage una sola vez en cliente.
  useEffect(() => {
    setActiveGroupIdState(readStored());
  }, []);

  // Reconcilia el id activo con la lista de grupos disponible:
  // - si el id persistido ya no pertenece a ningún grupo, se descarta;
  // - si no hay id válido y existe al menos un grupo, se toma el primero.
  useEffect(() => {
    if (loading || groups.length === 0) return;
    const valid = activeGroupId && groups.some((g) => g.id === activeGroupId);
    if (!valid) {
      setActiveGroupIdState(groups[0].id);
    }
  }, [loading, groups, activeGroupId]);

  const setActiveGroupId = useCallback((id: string | null) => {
    setActiveGroupIdState(id);
    if (typeof window === "undefined") return;
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Persiste cuando el id cambia por reconciliación (no solo por setter manual).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (activeGroupId) localStorage.setItem(STORAGE_KEY, activeGroupId);
  }, [activeGroupId]);

  const value = useMemo<ActiveGroupContextType>(
    () => ({ activeGroupId, setActiveGroupId, groups, loading }),
    [activeGroupId, setActiveGroupId, groups, loading],
  );

  return <ActiveGroupContext.Provider value={value}>{children}</ActiveGroupContext.Provider>;
}

export function useActiveGroup(): ActiveGroupContextType {
  const ctx = useContext(ActiveGroupContext);
  if (!ctx) throw new Error("useActiveGroup must be used within ActiveGroupProvider");
  return ctx;
}
