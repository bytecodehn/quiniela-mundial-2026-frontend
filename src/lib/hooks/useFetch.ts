"use client";

import { useCallback, useEffect, useState } from "react";

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

// Flags de mock por-módulo: permiten integrar el backend real un módulo a la
// vez sin volverse all-or-nothing. Cada flag cae al global USE_MOCKS si no se
// define. Next.js inlinea NEXT_PUBLIC_* solo con referencias literales, por eso
// cada flag se lee explícitamente (no por clave dinámica).
function moduleMock(value: string | undefined): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  return USE_MOCKS;
}

// Auth ya está integrado al backend real (F1). Default: false salvo que el
// entorno fuerce mocks (p.ej. la suite e2e setea NEXT_PUBLIC_USE_MOCKS=true y
// no define el de auth → auth cae a mock y el demo-login sigue funcionando).
export const USE_MOCKS_AUTH = moduleMock(process.env.NEXT_PUBLIC_USE_MOCKS_AUTH);

// Flags por-módulo para la integración incremental (F2–F6). Cada uno cae al
// global USE_MOCKS si no se define; se pone su env en "false" para activar el
// backend real de ese módulo. La suite e2e no los define → todo cae a mock.
export const USE_MOCKS_TOURNAMENT = moduleMock(process.env.NEXT_PUBLIC_USE_MOCKS_TOURNAMENT);
export const USE_MOCKS_GROUPS = moduleMock(process.env.NEXT_PUBLIC_USE_MOCKS_GROUPS);
export const USE_MOCKS_LEADERBOARD = moduleMock(process.env.NEXT_PUBLIC_USE_MOCKS_LEADERBOARD);
export const USE_MOCKS_PREDICTIONS = moduleMock(process.env.NEXT_PUBLIC_USE_MOCKS_PREDICTIONS);
export const USE_MOCKS_ADMIN = moduleMock(process.env.NEXT_PUBLIC_USE_MOCKS_ADMIN);

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(fn: () => Promise<T>, depsKey: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
    // fn is intentionally excluded; depsKey controls re-fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

export function mockDelay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
