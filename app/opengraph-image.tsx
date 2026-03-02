import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Claudine — Daily Check-in for the people you love most";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #fdfcf9 0%, #fdf8f0 40%, #fde8d8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(251,191,36,0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(244,149,107,0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 60,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(251,191,36,0.10)",
          }}
        />

        {/* Bear emoji */}
        <div style={{ fontSize: 110, marginBottom: 20, lineHeight: 1 }}>🐻</div>

        {/* Title */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: "#8b5e3c",
            letterSpacing: "-2px",
            marginBottom: 18,
            fontFamily: "serif",
          }}
        >
          Claudine
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: "#c8956c",
            maxWidth: 680,
            textAlign: "center",
            lineHeight: 1.45,
            fontFamily: "sans-serif",
            fontWeight: 500,
            marginBottom: 32,
          }}
        >
          A warm daily check-in for the people you love most
        </div>

        {/* Pill badge */}
        <div
          style={{
            padding: "12px 28px",
            borderRadius: 100,
            background: "rgba(245,158,11,0.12)",
            border: "2px solid rgba(245,158,11,0.35)",
            color: "#d97706",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: 2,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>✦</span>
          <span>INVITE-ONLY · 2 MINUTES A DAY</span>
          <span>✦</span>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 36,
            fontSize: 16,
            color: "#ddb393",
            fontFamily: "sans-serif",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          claudine-three.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
