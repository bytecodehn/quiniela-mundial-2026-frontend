"use client";

import { useCallback, useEffect, useState } from "react";

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

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
