"use client";

import {
  mockGroups,
  mockPredictions,
  mockRules,
  mockUser,
} from "./index";
import type { Group, Prediction, ScoringRule, User } from "@/types";

export type UserPatch = Partial<{ name: string; favoriteTeam: string; country: string; avatar: string | null }>;

// v2: se bumpeó la versión al cargar el fixture real del Mundial 2026. Esto
// descarta cualquier estado demo viejo persistido en el navegador (predicciones
// y grupos de la data de ejemplo anterior) para que se tomen los nuevos defaults.
const STORAGE_KEY = "qm26-mock-store-v2";

interface StoreState {
  groups: Group[];
  predictions: Prediction[];
  rules: ScoringRule[];
  user: User;
}

function defaults(): StoreState {
  return {
    groups: mockGroups.map((g) => ({ ...g })) as Group[],
    predictions: mockPredictions.map((p) => ({ ...p })) as Prediction[],
    rules: mockRules.map((r) => ({ ...r })) as ScoringRule[],
    user: { ...mockUser } as User,
  };
}

function readState(): StoreState {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    const base = defaults();
    return {
      groups: parsed.groups ?? base.groups,
      predictions: parsed.predictions ?? base.predictions,
      rules: parsed.rules ?? base.rules,
      user: parsed.user ?? base.user,
    };
  } catch {
    return defaults();
  }
}

function writeState(state: StoreState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / serialization errors
  }
}

export const mockStore = {
  listGroups: (): Group[] => readState().groups,
  addGroup: (group: Group) => {
    const s = readState();
    s.groups = [group, ...s.groups];
    writeState(s);
  },

  listPredictions: (): Prediction[] => readState().predictions,
  addPrediction: (prediction: Prediction) => {
    const s = readState();
    s.predictions = [
      prediction,
      ...s.predictions.filter((p) => p.match.id !== prediction.match.id),
    ];
    writeState(s);
  },

  listRules: (): ScoringRule[] => readState().rules,
  setRules: (rules: ScoringRule[]) => {
    const s = readState();
    s.rules = rules;
    writeState(s);
  },

  getUser: (): User => readState().user,
  setUser: (user: User) => {
    const s = readState();
    s.user = user;
    writeState(s);
  },
  patchUser: (patch: UserPatch) => {
    const s = readState();
    s.user = { ...s.user, ...patch, avatar: patch.avatar ?? s.user.avatar };
    writeState(s);
    return s.user;
  },

  reset: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};
