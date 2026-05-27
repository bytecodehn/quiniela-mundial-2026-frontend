"use client";

import { Button } from "./Button";

export function ErrorState({
  title = "Algo salió mal",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-[3rem] mb-4 opacity-40" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="text-[1.1rem] font-semibold text-fg mb-2">{title}</h3>
      {message && <p className="text-[0.9rem] text-fg-muted mb-6 max-w-[420px] mx-auto">{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
