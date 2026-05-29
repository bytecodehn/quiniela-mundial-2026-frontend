"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "./api";
import { identify, resetAnalytics, track } from "./analytics";
import { mockUser } from "./fixtures";
import { mockStore } from "./fixtures/store";
import { USE_MOCKS_AUTH } from "./hooks/useFetch";
import type { User } from "@/types";

type ProfileUpdate = Partial<{ name: string; favoriteTeam: string; country: string; avatar: string | null }>;

const MOCK_TOKEN = "mock-token-demo";

const DEMO_CREDENTIALS = {
  email: "carlos@example.com",
  password: "password123",
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    favoriteTeam?: string;
    country?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (data: ProfileUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Token + sesión los maneja api.ts (access + refresh, auto-refresh en 401).
  // USE_MOCKS_AUTH=true mantiene el flujo demo (sin backend) — usado por la
  // suite e2e y por entornos sin API disponible.
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    if (USE_MOCKS_AUTH) {
      setUser(mockStore.getUser());
      setLoading(false);
      return;
    }
    try {
      const res = await api.me();
      setUser(res.user);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    track("login_started", {});
    if (USE_MOCKS_AUTH) {
      if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
        track("login_failed", { reason: "invalid_credentials" });
        throw new Error("Credenciales demo inválidas");
      }
      mockStore.setUser(mockUser as User);
      localStorage.setItem("token", MOCK_TOKEN);
      setUser(mockUser as User);
      identify(mockUser.id, { country: mockUser.country, favorite_team: mockUser.favoriteTeam });
      track("login_completed", { user_id: mockUser.id });
      return;
    }
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      identify(res.user.id, { country: res.user.country, favorite_team: res.user.favoriteTeam });
      track("login_completed", { user_id: res.user.id });
    } catch (e) {
      track("login_failed", { reason: e instanceof Error ? e.message : "unknown" });
      throw e;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    favoriteTeam?: string;
    country?: string;
  }) => {
    if (USE_MOCKS_AUTH) {
      const fakeUser: User = {
        ...(mockUser as User),
        id: `mock-${Date.now()}`,
        name: data.name,
        email: data.email,
        avatar: data.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        favoriteTeam: data.favoriteTeam ?? mockUser.favoriteTeam,
        country: data.country ?? mockUser.country,
        createdAt: new Date().toISOString(),
      };
      mockStore.setUser(fakeUser);
      localStorage.setItem("token", MOCK_TOKEN);
      setUser(fakeUser);
      identify(fakeUser.id, { country: fakeUser.country, favorite_team: fakeUser.favoriteTeam });
      track("signup_completed", { user_id: fakeUser.id, country: data.country, favorite_team: data.favoriteTeam });
      return;
    }
    const res = await api.register(data);
    setUser(res.user);
    identify(res.user.id, { country: res.user.country, favorite_team: res.user.favoriteTeam });
    track("signup_completed", { user_id: res.user.id, country: data.country, favorite_team: data.favoriteTeam });
  };

  const logout = () => {
    track("logout_completed", {});
    resetAnalytics();
    if (USE_MOCKS_AUTH) {
      mockStore.reset();
      localStorage.removeItem("token");
    } else {
      // Revoca el refresh token en el backend y limpia tokens locales.
      void api.logout();
    }
    setUser(null);
  };

  const updateUser = async (data: ProfileUpdate) => {
    if (USE_MOCKS_AUTH) {
      const next = mockStore.patchUser(data);
      setUser(next);
      return;
    }
    const res = await api.updateMe(data);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
