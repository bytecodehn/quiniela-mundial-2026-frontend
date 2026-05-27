"use client";

import { LOCALE_LABELS, SUPPORTED_LOCALES, useLocale, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <span className="sr-only">{t.common.language}</span>
      <select
        aria-label={t.common.language}
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="bg-bg-surface border border-border text-fg px-3 py-1.5 rounded-radius-sm text-[0.85rem] outline-none cursor-pointer"
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code} className="bg-bg-primary text-fg">
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
