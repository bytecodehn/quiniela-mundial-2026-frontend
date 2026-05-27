"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";

const countries = [
  { value: "AR", label: "Argentina 🇦🇷" },
  { value: "BR", label: "Brasil 🇧🇷" },
  { value: "CL", label: "Chile 🇨🇱" },
  { value: "UY", label: "Uruguay 🇺🇾" },
  { value: "ES", label: "España 🇪🇸" },
  { value: "MX", label: "México 🇲🇽" },
  { value: "CO", label: "Colombia 🇨🇴" },
];

const favoriteTeams = [
  { value: "Argentina", label: "Argentina 🇦🇷" },
  { value: "Brasil", label: "Brasil 🇧🇷" },
  { value: "Uruguay", label: "Uruguay 🇺🇾" },
  { value: "Chile", label: "Chile 🇨🇱" },
  { value: "España", label: "España 🇪🇸" },
  { value: "Alemania", label: "Alemania 🇩🇪" },
  { value: "Francia", label: "Francia 🇫🇷" },
  { value: "Inglaterra", label: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { value: "Italia", label: "Italia 🇮🇹" },
  { value: "Países Bajos", label: "Países Bajos 🇳🇱" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("El nombre es obligatorio"); return; }
    if (!email.trim()) { setError("El email es obligatorio"); return; }
    if (!password) { setError("La contraseña es obligatoria"); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return; }
    if (!acceptTerms) { setError("Debés aceptar los términos y condiciones"); return; }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        passwordConfirm: confirmPassword,
        favoriteTeam: favoriteTeam || undefined,
      });
      router.push("/dashboard");
    } catch {
      setError("Ocurrió un error al crear la cuenta. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual panel */}
      <div className="flex-1 max-md:hidden bg-gradient-to-br from-green/20 via-bg-primary to-gold/10 relative overflow-hidden grid place-items-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(60%_0.18_145/0.08),transparent_70%)]" />
        <div className="relative text-center max-w-[420px]">
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-br from-green to-cyan rounded-radius-xl grid place-items-center">
            <span className="text-[2rem] font-extrabold text-white">Q</span>
          </div>
          <h2 className="text-[2rem] font-bold font-display mb-4">Unite a la quiniela</h2>
          <p className="text-[1rem] text-fg-secondary leading-relaxed">
            Cientos de usuarios ya están pronosticando cada partido del Mundial 2026. Sumate, competí y ganá prestigio.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {[
              "Registro gratuito y rápido",
              "Competí en rankings globales y grupos privados",
              "Seguí tus estadísticas en tiempo real",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 p-3 rounded-radius-lg bg-bg-white/5 border border-white/10">
                <span className="text-green text-[1.1rem]">✓</span>
                <span className="text-[0.85rem] text-fg-secondary">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 grid place-items-center p-8 max-md:p-6 overflow-y-auto">
        <div className="w-full max-w-[400px] py-4">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 no-underline mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-green to-cyan rounded-radius-md grid place-items-center text-[1.2rem] font-extrabold text-white">
              Q
            </div>
            <span className="font-display font-bold text-[1.1rem] text-fg">Quiniela 2026</span>
          </Link>

          <h1 className="text-[1.8rem] font-bold font-display mb-2">Crear cuenta</h1>
          <p className="text-[0.95rem] text-fg-secondary mb-8">Completá el formulario para registrarte</p>

          {error && (
            <div className="bg-red-bg/50 border border-red/30 text-red text-[0.9rem] px-4 py-3 rounded-radius-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Nombre"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="Repetí tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Country select */}
            <div className="mb-5">
              <label className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">
                País <span className="text-fg-muted font-normal">(opcional)</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-radius-md text-fg text-[0.95rem] outline-none appearance-none cursor-pointer focus:border-green focus:shadow-[0_0_0_3px_oklch(60%_0.18_145/0.15)]"
              >
                <option value="" className="bg-bg-primary text-fg-muted">Seleccioná tu país</option>
                {countries.map((c) => (
                  <option key={c.value} value={c.value} className="bg-bg-primary text-fg">{c.label}</option>
                ))}
              </select>
            </div>

            {/* Team select */}
            <div className="mb-5">
              <label className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">
                Equipo favorito <span className="text-fg-muted font-normal">(opcional)</span>
              </label>
              <select
                value={favoriteTeam}
                onChange={(e) => setFavoriteTeam(e.target.value)}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-radius-md text-fg text-[0.95rem] outline-none appearance-none cursor-pointer focus:border-green focus:shadow-[0_0_0_3px_oklch(60%_0.18_145/0.15)]"
              >
                <option value="" className="bg-bg-primary text-fg-muted">Seleccioná tu equipo</option>
                {favoriteTeams.map((t) => (
                  <option key={t.value} value={t.value} className="bg-bg-primary text-fg">{t.label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-3 mb-8 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 accent-green rounded-radius-sm bg-bg-surface border border-border mt-0.5 shrink-0"
              />
              <span className="text-[0.85rem] text-fg-secondary leading-relaxed">
                Acepto los <span className="text-green hover:underline">términos y condiciones</span> y la{" "}
                <span className="text-green hover:underline">política de privacidad</span>
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <p className="text-center mt-8 text-[0.9rem] text-fg-secondary">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-green font-semibold hover:underline">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
