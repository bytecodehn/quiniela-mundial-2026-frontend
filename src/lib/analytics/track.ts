"use client";

import type { EventMap, EventName } from "./events";

export interface AnalyticsProvider {
  track<E extends EventName>(event: E, props: EventMap[E]): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  reset(): void;
}

class NoopProvider implements AnalyticsProvider {
  track(): void {}
  identify(): void {}
  reset(): void {}
}

class ConsoleProvider implements AnalyticsProvider {
  track<E extends EventName>(event: E, props: EventMap[E]): void {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line no-console
    console.info("[analytics] track", event, props);
  }
  identify(userId: string, traits?: Record<string, unknown>): void {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line no-console
    console.info("[analytics] identify", userId, traits);
  }
  reset(): void {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line no-console
    console.info("[analytics] reset");
  }
}

const debug = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";
let provider: AnalyticsProvider = debug ? new ConsoleProvider() : new NoopProvider();

/**
 * Sustituye el provider en runtime (útil cuando se enchufe PostHog/Mixpanel/GA).
 * Llamar una vez en el root layout antes de que el árbol monte sus efectos.
 */
export function setAnalyticsProvider(p: AnalyticsProvider): void {
  provider = p;
}

export function track<E extends EventName>(event: E, props: EventMap[E]): void {
  provider.track(event, props);
}

export function identify(userId: string, traits?: Record<string, unknown>): void {
  provider.identify(userId, traits);
}

export function resetAnalytics(): void {
  provider.reset();
}
