export function StatCard({
  label,
  value,
  change,
  changeUp,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeUp?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.8rem] text-fg-muted uppercase tracking-wider font-semibold">{label}</span>
      <span className="text-[2rem] font-bold font-display tracking-tight">{value}</span>
      {change && (
        <span
          className={`text-[0.8rem] font-semibold flex items-center gap-1 ${changeUp ? "text-green" : "text-red"}`}
        >
          {changeUp ? "↑" : "↓"} {change}
        </span>
      )}
    </div>
  );
}
