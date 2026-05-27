"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);
const AUTO_DISMISS_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  const api: ToastApi = {
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="region"
        aria-label="Notificaciones"
        className="fixed bottom-4 right-4 z-[1000] flex flex-col gap-2 max-w-[360px] max-md:bottom-20 max-md:right-4 max-md:left-4 max-md:max-w-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const styles: Record<ToastVariant, string> = {
    success: "bg-green-bg border-green/40 text-green",
    error: "bg-red-bg border-red/40 text-red",
    info: "bg-bg-elevated border-border text-fg",
  };
  const icons: Record<ToastVariant, string> = { success: "✓", error: "⚠", info: "ℹ" };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 px-4 py-3 rounded-radius-md border shadow-[0_8px_24px_rgba(0,0,0,0.35)] animate-in fade-in slide-in-from-right-2 duration-200 ${styles[toast.variant]}`}
    >
      <span className="text-[1rem] font-bold shrink-0" aria-hidden="true">
        {icons[toast.variant]}
      </span>
      <span className="flex-1 text-[0.9rem] leading-snug">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className="text-[0.85rem] opacity-60 hover:opacity-100 cursor-pointer bg-transparent border-none p-0 leading-none"
      >
        ✕
      </button>
    </div>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
