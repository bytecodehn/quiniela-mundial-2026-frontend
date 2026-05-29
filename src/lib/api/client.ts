// Infra compartida del cliente HTTP: base URL, manejo de tokens
// (access + refresh con auto-refresh en 401) y el wrapper request().
// Cada dominio (auth/tournament/groups/...) vive en su propio archivo y
// consume estos helpers, así varios módulos se integran en paralelo sin
// pisarse en un único api.ts.

// Base URL del backend Go (montado en la raíz, sin prefijo /api/v1).
// NEXT_PUBLIC_API_URL=http://192.168.244.128:8888 (dev server).
export const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888";

// El access token se guarda bajo "token" (compat con auth.tsx, que lo lee
// directo como check de sesión). El refresh token va aparte.
const ACCESS_KEY = "token";
const REFRESH_KEY = "refresh_token";

export function getAccess(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null;
}
export function getRefresh(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null;
}
export function setTokens(access: string, refresh?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function rawRequest(path: string, options?: RequestInit, withAuth = true): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) ?? {}),
  };
  if (withAuth) {
    const token = getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${BASE}${path}`, { ...options, headers });
}

// Un único refresh en vuelo a la vez: si varios requests dan 401 en paralelo,
// comparten la misma promesa de refresh en lugar de dispararlo N veces.
let refreshInflight: Promise<boolean> | null = null;
async function tryRefresh(): Promise<boolean> {
  const rt = getRefresh();
  if (!rt) return false;
  if (!refreshInflight) {
    refreshInflight = (async () => {
      try {
        const res = await rawRequest(
          "/auth/refresh",
          { method: "POST", body: JSON.stringify({ refresh_token: rt }) },
          false,
        );
        if (!res.ok) {
          clearTokens();
          return false;
        }
        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);
        return true;
      } catch {
        return false;
      } finally {
        refreshInflight = null;
      }
    })();
  }
  return refreshInflight;
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res = await rawRequest(path, options);

  // Access token vencido (15 min): intenta refresh una vez y reintenta.
  if (res.status === 401 && getRefresh()) {
    const ok = await tryRefresh();
    if (ok) res = await rawRequest(path, options);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
