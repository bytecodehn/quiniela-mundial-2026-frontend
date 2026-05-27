/**
 * Tipos de eventos analíticos del producto.
 *
 * Estos nombres y propiedades viven en código (no en string libres) para
 * que TypeScript bloquee tipos en el call site. Cuando se enchufe un
 * proveedor real (PostHog / Mixpanel / GA), no es necesario tocar los
 * call sites: solo el provider en `track.ts`.
 */

export type PredictionSource = "dashboard" | "matches_list" | "match_detail" | "reminder";

export type LeaderboardScope = "global" | "group";

export interface EventMap {
  // Auth
  signup_started: { source?: string };
  signup_completed: { user_id: string; country?: string; favorite_team?: string };
  login_started: Record<string, never>;
  login_completed: { user_id: string };
  login_failed: { reason?: string };
  logout_completed: Record<string, never>;

  // Predicciones
  prediction_started: { match_id: string; source: PredictionSource };
  prediction_saved: {
    match_id: string;
    home_score: number;
    away_score: number;
    source: PredictionSource;
    is_edit: boolean;
  };
  match_deadline_seen: { match_id: string; deadline_hours_remaining: number };

  // Grupos
  group_created: { group_id: string; name: string };
  group_joined: { group_id: string; invite_code: string };
  invite_copied: { group_id: string };

  // Discovery
  leaderboard_viewed: { scope: LeaderboardScope; group_id?: string };

  // Monetización (todavía no implementado, contrato preparado)
  premium_paywall_seen: { feature: string };
  checkout_started: { plan: string };
  checkout_completed: { plan: string; price: number };
}

export type EventName = keyof EventMap;
