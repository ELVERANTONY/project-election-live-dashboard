import { ImageResponse } from "next/og";
import { fetchElectoralData } from "@/lib/electoral";

export const alt = "¿Nieto pasa a Aliaga? | Primera Vuelta 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Re-generate on every request so numbers are current
export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("es-PE");
}

export default async function Image() {
  let data: Awaited<ReturnType<typeof fetchElectoralData>> | null = null;
  try {
    data = await fetchElectoralData();
  } catch {
    // render fallback below
  }

  const BG     = "#0e141a";
  const CARD   = "#1a2027";
  const BORDER = "#444651";
  const TEXT   = "#dde3ec";
  const MUTED  = "#8e909c";
  const BLUE   = "#b2c5ff";
  const ORANGE = "#ffb4a2";

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: MUTED,
            fontSize: 32,
            fontFamily: "sans-serif",
          }}
        >
          ¿Nieto pasa a Aliaga? · Primera Vuelta 2026
        </div>
      ),
      { ...size }
    );
  }

  const [aliaga, nieto, sanchez] = data.contenders;

  const barTotal = aliaga.votes + nieto.votes + sanchez.votes;
  const aliagaW  = Math.round((aliaga.votes  / barTotal) * 680);
  const nietoW   = Math.round((nieto.votes   / barTotal) * 680);
  const sanchezW = 680 - aliagaW - nietoW;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          flexDirection: "column",
          padding: "48px 64px",
          fontFamily: "sans-serif",
          color: TEXT,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <div
            style={{
              width: 6,
              height: 32,
              background: BLUE,
              marginRight: 16,
              borderRadius: 2,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 14, color: MUTED, letterSpacing: 3, textTransform: "uppercase" }}>
              Primera Vuelta 2026
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginTop: 2 }}>
              ¿Cuántos votos le faltan a Nieto para pasar a Aliaga?
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#1a2027",
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: "6px 14px",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#4ade80",
                marginRight: 8,
              }}
            />
            <span style={{ fontSize: 13, color: MUTED }}>EN VIVO · {data.lastSync}</span>
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: BORDER, margin: "20px 0" }} />

        {/* Keiko banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            padding: "12px 20px",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 13, color: MUTED, marginRight: 12, textTransform: "uppercase", letterSpacing: 2 }}>
            Keiko Fujimori
          </span>
          <span style={{ fontSize: 28, fontWeight: 700, color: BLUE, marginRight: 8 }}>
            {data.keiko.officialPct.toFixed(2)}%
          </span>
          <span style={{ fontSize: 13, color: MUTED }}>· {fmt(data.keiko.votes)} votos</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: MUTED }}>
            Actas contabilizadas: {data.actasProcessed.toLocaleString("es-PE")}
          </span>
        </div>

        {/* Three contenders */}
        <div style={{ display: "flex", flexDirection: "row", marginBottom: 24, columnGap: 16 }}>
          {[aliaga, nieto, sanchez].map((c, i) => (
            <div
              key={c.id}
              style={{
                flex: 1,
                background: i === 1 ? "#0d1e38" : CARD,
                border: `1px solid ${i === 1 ? BLUE : BORDER}`,
                borderRadius: 4,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                marginLeft: i > 0 ? 16 : 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: i === 1 ? BLUE : MUTED,
                    background: i === 1 ? "#002c74" : "#252b31",
                    borderRadius: 2,
                    padding: "2px 7px",
                    marginRight: 8,
                    letterSpacing: 1,
                  }}
                >
                  #{c.rank}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{c.name}</span>
              </div>
              <span style={{ fontSize: 30, fontWeight: 700, color: i === 1 ? BLUE : TEXT, marginBottom: 4 }}>
                {c.officialPct.toFixed(2)}%
              </span>
              <span style={{ fontSize: 12, color: MUTED }}>{fmt(c.votes)} votos válidos</span>
            </div>
          ))}
        </div>

        {/* Race bar */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "row", height: 12, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: aliagaW, height: 12, background: "#6a95ff" }} />
            <div style={{ width: nietoW,  height: 12, background: BLUE }} />
            <div style={{ width: sanchezW, height: 12, background: ORANGE }} />
          </div>
        </div>

        {/* Gap row */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: "12px 20px",
            }}
          >
            <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              Brecha Aliaga → Nieto
            </span>
            <span style={{ fontSize: 26, fontWeight: 700, color: data.nietoLeading ? "#4ade80" : ORANGE }}>
              {data.nietoLeading ? "-" : "+"}{fmt(data.gap23)} votos
            </span>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: "12px 20px",
              marginLeft: 16,
            }}
          >
            <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              Ventaja Nieto → Sánchez
            </span>
            <span style={{ fontSize: 26, fontWeight: 700, color: BLUE }}>
              +{fmt(data.gap34)} votos
            </span>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: "12px 20px",
              marginLeft: 16,
            }}
          >
            <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              Participación ciudadana
            </span>
            <span style={{ fontSize: 26, fontWeight: 700, color: TEXT }}>
              {data.turnout.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
