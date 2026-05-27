"use client";

export function Select({
  options,
  value,
  onChange,
  className = "",
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-bg-surface border border-border text-fg px-4 py-2 rounded-radius-md text-[0.9rem] outline-none min-w-[140px] cursor-pointer ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-bg-primary text-fg">
          {o.label}
        </option>
      ))}
    </select>
  );
}
