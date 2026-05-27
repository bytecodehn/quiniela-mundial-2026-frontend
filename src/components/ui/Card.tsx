import { type HTMLAttributes, type ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-bg-surface border border-border rounded-radius-lg p-6 transition-all duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h3 className={`text-[1.05rem] font-semibold text-fg ${className}`}>{children}</h3>;
}
