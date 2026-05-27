"use client";

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex gap-1 mb-6 flex-wrap">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-5 py-2.5 rounded-radius-md text-[0.9rem] font-medium border-none transition-all duration-150 cursor-pointer ${
            t === active ? "bg-green text-white" : "text-fg-secondary hover:text-fg hover:bg-bg-surface"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
