"use client";

import { useEffect } from "react";

/**
 * Registra /sw.js solo en producción. En dev queda fuera para no
 * interferir con HMR/refresh de Next.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      // eslint-disable-next-line no-console
      console.warn("SW registration failed", err);
    });
  }, []);

  return null;
}
