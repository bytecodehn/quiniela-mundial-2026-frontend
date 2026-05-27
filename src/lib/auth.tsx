"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "./api";
import { mockUser } from "./fixtures";
import { USE_MOCKS } from "./hooks/useFetch";
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

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    if (USE_MOCKS) {
      setUser(mockUser as User);
      setLoading(false);
      return;
    }
    try {
      const res = await api.me();
      setUser(res.user);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email: string, password: string) => {
    if (USE_MOCKS) {
      if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
        throw new Error("Credenciales demo inválidas");
      }
      localStorage.setItem("token", MOCK_TOKEN);
      setUser(mockUser as User);
      return;
    }
    const res = await api.login({ email, password });
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    favoriteTeam?: string;
    country?: string;
  }) => {
    if (USE_MOCKS) {
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
      localStorage.setItem("token", MOCK_TOKEN);
      setUser(fakeUser);
      return;
    }
    const res = await api.register(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = async (data: ProfileUpdate) => {
    if (USE_MOCKS) {
      setUser((prev) => (prev ? { ...prev, ...data } : prev));
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
