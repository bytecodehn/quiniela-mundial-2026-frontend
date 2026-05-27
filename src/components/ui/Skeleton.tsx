export function Skeleton({ className = "", rounded = "md" }: { className?: string; rounded?: "sm" | "md" | "lg" | "full" }) {
  return (
    <div
      className={`bg-bg-surface animate-pulse rounded-radius-${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonRows({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}
