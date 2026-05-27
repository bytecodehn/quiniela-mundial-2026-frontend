"use client";

import { type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-bg-elevated border border-border rounded-radius-xl w-full max-w-lg p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.2rem] font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-none border-none text-fg-muted text-[1.2rem] grid place-items-center rounded-radius-sm hover:bg-bg-surface hover:text-fg transition-all duration-150"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
