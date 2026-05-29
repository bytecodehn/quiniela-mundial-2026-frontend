"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("El email es obligatorio"); return; }
    if (!password) { setError("La contraseña es obligatoria"); return; }

    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Credenciales inválidas. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual panel */}
      <div className="flex-1 max-md:hidden bg-gradient-to-br from-green/25 via-violet/15 to-magenta/15 relative overflow-hidden grid place-items-center p-12">
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(255,184,0,0.18),transparent_70%)]" />
        <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(0,200,150,0.18),transparent_70%)]" />
        <div className="relative text-center max-w-[420px]">
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-br from-green to-blue rounded-radius-xl grid place-items-center shadow-[0_12px_28px_rgba(77,124,255,0.35)]">
            <span className="text-[2rem] font-extrabold text-white">Q</span>
          </div>
          <h2 className="text-[2rem] font-bold font-display mb-4">Bienvenido de vuelta</h2>
          <p className="text-[1rem] text-fg-secondary leading-relaxed">
            Seguí compitiendo en el ranking, hacé nuevas predicciones y demostrá que nadie conoce más el fútbol que vos.
          </p>
          <div className="mt-10 flex flex-col gap-3 text-left">
            {[
              { stat: "104", label: "Partidos del torneo" },
              { stat: "12", label: "Grupos · 48 selecciones" },
              { stat: "Live", label: "Ranking en tiempo real" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 p-3 rounded-radius-lg bg-bg-white/5 border border-white/10">
                <span className="text-[1.2rem] font-extrabold text-green font-display">{item.stat}</span>
                <span className="text-[0.85rem] text-fg-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 grid place-items-center p-8 max-md:p-6">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 no-underline mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-green to-cyan rounded-radius-md grid place-items-center text-[1.2rem] font-extrabold text-white">
              Q
            </div>
            <span className="font-display font-bold text-[1.1rem] text-fg">Quiniela 2026</span>
          </Link>

          <h1 className="text-[1.8rem] font-bold font-display mb-2">Iniciar sesión</h1>
          <p className="text-[0.95rem] text-fg-secondary mb-8">Ingresá tus credenciales para continuar</p>

          {error && (
            <div className="bg-red-bg/50 border border-red/30 text-red text-[0.9rem] px-4 py-3 rounded-radius-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-[0.85rem] text-fg-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-green rounded-radius-sm bg-bg-surface border border-border"
                />
                Recordarme
              </label>
              <span className="text-[0.85rem] text-green hover:underline cursor-pointer">¿Olvidaste tu contraseña?</span>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[0.8rem] text-fg-muted">o probá rápido</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={() => {
              setEmail("carlos@example.com");
              setPassword("password123");
            }}
          >
            <span className="text-[1.2rem]">👤</span>
            Usar cuenta demo
          </Button>

          <p className="text-center mt-8 text-[0.9rem] text-fg-secondary">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-green font-semibold hover:underline">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
