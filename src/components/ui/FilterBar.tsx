import { type ReactNode } from "react";

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 items-center flex-wrap mb-6">{children}</div>;
}
