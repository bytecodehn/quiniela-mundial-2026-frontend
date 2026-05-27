import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Quiniela Mundial 2026",
  description:
    "Pronostica los partidos del Mundial 2026, compite con tus amigos y lidera el ranking. Una plataforma social de predicciones deportivas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
