import { ImageResponse } from "next/og";
import { fetchElectoralData } from "@/lib/electoral";

export const alt = "¿Nieto pasa a Aliaga? | Primera Vuelta 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("es-PE");
}

const BG      = "#0e141a";
const CARD    = "#161c22";
const TEXT    = "#dde3ec";
const MUTED   = "#8e909c";
const BLUE    = "#b2c5ff";
const BLUE_DK = "#002c74";
const GRAY    = "#c6c6c7";
const CORAL   = "#ffb4a2";
const BORDER  = "#444651";
const GREEN   = "#4ade80";

export default async function Image() {
  let data: Awaited<ReturnType<typeof fetchElectoralData>> | null = null;
  try {
    data = await fetchElectoralData();
  } catch {
    // render fallback below
  }

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
            flexDirection: "column",
            gap: 12,
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: 48, color: TEXT, fontWeight: 700 }}>
            ¿Nieto pasa a Aliaga?
          </span>
          <span style={{ fontSize: 20, color: MUTED }}>
            Primera Vuelta 2026 · En vivo
          </span>
        </div>
      ),
      { ...size }
    );
  }

  const [aliaga, nieto, sanchez] = data.contenders;

  const barTotal = aliaga.votes + nieto.votes + sanchez.votes;
  const BAR_W   = 1100;
  const aliagaW  = Math.round((aliaga.votes  / barTotal) * BAR_W);
  const nietoW   = Math.round((nieto.votes   / barTotal) * BAR_W);
  const sanchezW = BAR_W - aliagaW - nietoW;

  const actas_pct = data.actasProcessed > 0
    ? ((data.actasProcessed / (data.actasProcessed + (data.actasProcessed * (1 - data.turnout / 100)))) * 100).toFixed(1)
    : "—";

  const gapColor  = data.nietoLeading ? GREEN : TEXT;
  const gapPrefix = data.nietoLeading ? "−" : "+";
  const gapLabel  = data.nietoLeading
    ? "Nieto supera a Aliaga por"
    : "Le faltan a Nieto";
  const gapSub    = data.nietoLeading
    ? "votos · Nieto pasaría a segunda vuelta"
    : "votos para superar a López Aliaga";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 48px",
            height: 64,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <span style={{ fontSize: 28, marginRight: 12 }}>🌞</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: TEXT }}>
            ¿Nieto pasa a Aliaga?
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: GREEN,
              }}
            />
            <span style={{ fontSize: 13, color: MUTED, letterSpacing: 2, textTransform: "uppercase" }}>
              EN VIVO · {data.lastSync}
            </span>
          </div>
        </div>

        {/* GapHero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "24px 48px 8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#631200",
              borderRadius: 4,
              padding: "4px 14px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 12, color: CORAL, letterSpacing: 2, textTransform: "uppercase" }}>
              Actas contabilizadas: {fmt(data.actasProcessed)}
            </span>
          </div>

          <span style={{ fontSize: 16, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
            {gapLabel}
          </span>

          <span style={{ fontSize: 88, fontWeight: 700, color: gapColor, lineHeight: 1 }}>
            {gapPrefix}{fmt(data.gap23)}
          </span>

          <span style={{ fontSize: 18, color: MUTED, marginTop: 12 }}>
            {gapSub}
          </span>

          <span style={{ fontSize: 14, color: CORAL, marginTop: 10 }}>
            Nieto le lleva +{fmt(data.gap34)} votos a Sánchez
          </span>
        </div>

        {/* Candidate cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "0 48px",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {/* Aliaga */}
          <div
            style={{
              flex: 1,
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderLeft: `4px solid ${GRAY}`,
              borderRadius: 4,
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              2do lugar
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: GRAY, textTransform: "uppercase", marginBottom: 4 }}>
              {aliaga.name}
            </span>
            <span style={{ fontSize: 32, fontWeight: 700, color: GRAY }}>{aliaga.officialPct.toFixed(2)}%</span>
            <span style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{fmt(aliaga.votes)} votos</span>
          </div>

          {/* Nieto — highlighted */}
          <div
            style={{
              flex: 1,
              background: BLUE_DK,
              border: `1px solid ${BLUE}`,
              borderLeft: `4px solid ${BLUE}`,
              borderRadius: 4,
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: 10, color: BLUE, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              3er lugar — en disputa
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: BLUE, textTransform: "uppercase", marginBottom: 4 }}>
              {nieto.name}
            </span>
            <span style={{ fontSize: 32, fontWeight: 700, color: BLUE }}>{nieto.officialPct.toFixed(2)}%</span>
            <span style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{fmt(nieto.votes)} votos</span>
          </div>

          {/* Sánchez */}
          <div
            style={{
              flex: 1,
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderLeft: `4px solid ${CORAL}`,
              borderRadius: 4,
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              4to lugar
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: CORAL, textTransform: "uppercase", marginBottom: 4 }}>
              {sanchez.name}
            </span>
            <span style={{ fontSize: 32, fontWeight: 700, color: CORAL }}>{sanchez.officialPct.toFixed(2)}%</span>
            <span style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{fmt(sanchez.votes)} votos</span>
          </div>
        </div>

        {/* Vote bar */}
        <div style={{ display: "flex", flexDirection: "column", padding: "0 48px", marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "row", height: 14, overflow: "hidden" }}>
            <div style={{ width: aliagaW,  height: 14, background: GRAY }} />
            <div style={{ width: 2,        height: 14, background: BG }} />
            <div style={{ width: nietoW,   height: 14, background: BLUE }} />
            <div style={{ width: 2,        height: 14, background: BG }} />
            <div style={{ width: sanchezW, height: 14, background: CORAL }} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: GRAY, width: aliagaW }}>López Aliaga</span>
            <span style={{ fontSize: 11, color: BLUE, width: nietoW, textAlign: "center" }}>Nieto</span>
            <span style={{ fontSize: 11, color: CORAL, flex: 1, textAlign: "right" }}>Sánchez</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "12px 48px",
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <span style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2 }}>Keiko Fujimori</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{data.keiko.officialPct.toFixed(2)}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2 }}>Keiko · Votos</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{fmt(data.keiko.votes)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "flex-end" }}>
            <span style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 2 }}>Participación</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{data.turnout.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
