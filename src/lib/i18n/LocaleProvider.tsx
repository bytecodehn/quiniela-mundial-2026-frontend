"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  dictionaries,
  SUPPORTED_LOCALES,
  type Dictionary,
  type Locale,
} from "./dictionaries";

const STORAGE_KEY = "qm26-locale";
const DEFAULT_LOCALE: Locale = "es";

function isLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED_LOCALES as string[]).includes(value);
}

function detectInitialLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const browser = navigator.language ?? DEFAULT_LOCALE;
  if (browser.toLowerCase().startsWith("pt")) return "pt-BR";
  if (browser.toLowerCase().startsWith("en")) return "en";
  return "es";
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Render inicial siempre con DEFAULT_LOCALE para evitar hydration mismatch.
  // Después leemos localStorage / navigator.language en useEffect.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (isLocale(stored)) {
      setLocaleState(stored);
      return;
    }
    setLocaleState(detectInitialLocale());
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.setAttribute("lang", next);
    }
  };

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: dictionaries[locale],
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

/** Atajo cuando solo se necesita el diccionario. */
export function useT(): Dictionary {
  return useLocale().t;
}
