import { type ReactNode } from "react";

export function EmptyState({ icon, text, action }: { icon: string; text: string; action?: ReactNode }) {
  return (
    <div className="text-center py-12 px-6 text-fg-muted">
      <div className="text-[3rem] mb-4 opacity-40">{icon}</div>
      <p className="text-[1rem] mb-6 max-w-[360px] mx-auto">{text}</p>
      {action}
    </div>
  );
}
