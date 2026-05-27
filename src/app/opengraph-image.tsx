import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiniela Mundial 2026 — Pronostica, compite, lidera el ranking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Glow radial sutil arriba a la derecha */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo Q */}
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 36,
            background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 140,
            fontWeight: 900,
            color: "white",
            marginBottom: 48,
            boxShadow: "0 20px 60px rgba(34, 197, 94, 0.3)",
          }}
        >
          Q
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: -2,
            display: "flex",
          }}
        >
          Quiniela Mundial 2026
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 32,
            color: "#a3a3a3",
            marginTop: 20,
            display: "flex",
            gap: 16,
          }}
        >
          <span>Pronostica</span>
          <span style={{ color: "#525252" }}>·</span>
          <span>Compite</span>
          <span style={{ color: "#525252" }}>·</span>
          <span>Lidera el ranking</span>
        </div>

        {/* Tag inferior */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 20px",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: 999,
            background: "rgba(34, 197, 94, 0.08)",
            color: "#22c55e",
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              display: "block",
            }}
          />
          Mundial 2026 · Ya disponible
        </div>
      </div>
    ),
    { ...size },
  );
}
