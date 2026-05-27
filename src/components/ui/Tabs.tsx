"use client";

export function Tabs({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
  label?: string;
}) {
  return (
    <div role="tablist" aria-label={label ?? "Pestañas"} className="flex gap-1 mb-6 flex-wrap">
      {tabs.map((t) => {
        const selected = t === active;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t)}
            className={`px-5 py-2.5 rounded-radius-md text-[0.9rem] font-medium border-none transition-all duration-150 cursor-pointer ${
              selected ? "bg-green text-white" : "text-fg-secondary hover:text-fg hover:bg-bg-surface"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
