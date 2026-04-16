import { ImageResponse } from "next/og";
import { fetchElectoralData } from "@/lib/electoral";

export const alt = "¿Aliaga pasa a Sánchez? | Primera Vuelta 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString("es-PE");
}

const ONPE_HEADERS = {
  Referer: "https://resultadoelectoral.onpe.gob.pe/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};

async function fetchPhotoDataUrl(dni: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://resultadoelectoral.onpe.gob.pe/assets/img-reales/candidatos/${dni}.jpg`,
      { headers: ONPE_HEADERS, cache: "no-store" }
    );
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");
    return `data:image/jpeg;base64,${b64}`;
  } catch {
    return null;
  }
}

const BG      = "#0e141a";
const CARD    = "#161c22";
const TEXT    = "#dde3ec";
const MUTED   = "#8e909c";
const BLUE    = "#b2c5ff";
const SECONDARY = "#00f0ff"; // Aliaga Cyan/Blue
const TERTIARY  = "#ff4d4d"; // Sanchez Red
const BORDER  = "#444651";
const GREEN   = "#4ade80";

export default async function Image() {
  let data: Awaited<ReturnType<typeof fetchElectoralData>> | null = null;
  try {
    data = await fetchElectoralData();
  } catch {
    // fallback
  }

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%", height: "100%", background: BG,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 12, fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: 48, color: TEXT, fontWeight: 700 }}>¿Aliaga pasa a Sánchez?</span>
          <span style={{ fontSize: 20, color: MUTED }}>Primera Vuelta 2026 · En vivo</span>
        </div>
      ),
      { ...size }
    );
  }

  const [aliaga, sanchez] = data.contenders;

  // Extract DNIs from imageUrl (/api/candidato-img/{dni})
  const aliagaDni  = aliaga.imageUrl.split("/").pop() ?? "";
  const sanchezDni = sanchez.imageUrl.split("/").pop() ?? "";

  const [aliagaImg, sanchezImg] = await Promise.all([
    fetchPhotoDataUrl(aliagaDni),
    fetchPhotoDataUrl(sanchezDni),
  ]);

  const BAR_W    = 1104;
  const barTotal = aliaga.votes + sanchez.votes;
  const aliagaW  = Math.round((aliaga.votes  / barTotal) * BAR_W);
  const sanchezW = BAR_W - aliagaW;

  const aliagaLeading = data.aliagaLeadingSanchez;
  
  const gapLabel  = aliagaLeading ? "Aliaga supera a Sánchez por" : "A Aliaga le falta superar a Sánchez por";
  const gapColor  = aliagaLeading ? GREEN : TERTIARY;

  const accentOf = { aliaga: SECONDARY, sanchez: TERTIARY } as const;
  const rankLabelOf = { 2: "2DO LUGAR", 3: "3ER LUGAR" } as const;

  const candidatesSorted = [...data.contenders].sort((a, b) => b.votes - a.votes);
  const candidateCards = candidatesSorted.map((c) => ({
    c,
    img: c.id === "aliaga" ? aliagaImg : sanchezImg,
    rankLabel: rankLabelOf[c.rank as 2 | 3],
    accent: accentOf[c.id],
    cardBg: CARD,
    highlight: c.id === "aliaga",
  }));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: BG, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 48px", height: 52, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: SECONDARY, marginRight: 14 }}>R</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>¿Aliaga pasa a Sánchez?</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: 999, background: GREEN }} />
            <span style={{ fontSize: 12, color: MUTED, letterSpacing: 2, textTransform: "uppercase" }}>
              EN VIVO · {data.lastSync}
            </span>
          </div>
        </div>

        {/* Keiko banner */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 48px", height: 46, background: CARD, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: "#ff9000", marginRight: 10 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 9, color: MUTED, textTransform: "uppercase", letterSpacing: 2 }}>1ER LUGAR — CLASIFICADA A SEGUNDA VUELTA</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>KEIKO FUJIMORI</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{fmt(data.keiko.votes)} votos</span>
            <span style={{ fontSize: 10, color: MUTED }}>{data.keiko.officialPct.toFixed(2)}% válidos</span>
          </div>
        </div>

        {/* GapHero */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: 180 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#333", borderRadius: 3, padding: "3px 12px", width: "fit-content", marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: TEXT, letterSpacing: 2, textTransform: "uppercase" }}>
                Actas: {data.actasProcessed.toFixed(3)}%
              </span>
            </div>
            <span style={{ fontSize: 13, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{gapLabel}</span>
            <span style={{ fontSize: 86, fontWeight: 700, color: gapColor, lineHeight: 1 }}>
              {fmt(data.gapToRunoff)}
            </span>
          </div>

          {!aliagaLeading && (
             <div style={{ display: "flex", flexDirection: "column", borderLeft: `1px solid ${BORDER}`, paddingLeft: 30, maxWidth: 300 }}>
                <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Probabilidad</span>
                <span style={{ fontSize: 42, fontWeight: 700, color: data.aliagaProbability > 50 ? GREEN : TERTIARY }}>{data.aliagaProbability}%</span>
                <span style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
                  Necesita el {data.requiredRemainingShare}% del saldo de votos.
                </span>
             </div>
          )}
        </div>

        {/* Vote bar */}
        <div style={{ display: "flex", flexDirection: "column", padding: "0 48px", marginBottom: 12 }}>
          <div style={{ display: "flex", flexDirection: "row", height: 16, overflow: "hidden", borderRadius: 2 }}>
            <div style={{ width: aliagaW,  height: 16, background: SECONDARY }} />
            <div style={{ width: sanchezW, height: 16, background: TERTIARY  }} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginTop: 8, justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: SECONDARY }}>López Aliaga {aliaga.officialPct.toFixed(2)}%</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: TERTIARY }}>Sánchez {sanchez.officialPct.toFixed(2)}%</span>
          </div>
        </div>

        {/* Candidate cards */}
        <div style={{ display: "flex", flexDirection: "row", padding: "0 48px", gap: 16, flex: 1 }}>
          {candidateCards.map(({ c, img, rankLabel, accent, cardBg, highlight }) => (
            <div
              key={c.id}
              style={{
                flex: 1,
                background: cardBg,
                border: `1px solid ${highlight ? accent : BORDER}`,
                borderLeft: `6px solid ${accent}`,
                borderRadius: 4,
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                height: 130
              }}
            >
              <div style={{ width: 100, flexShrink: 0, background: "#000", display: "flex" }}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={c.name} width={100} height={130} style={{ width: 100, height: 130, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 100, height: 130, background: accent + "22" }} />
                )}
              </div>
              <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{rankLabel}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, textTransform: "uppercase", marginBottom: 8 }}>{c.name}</span>
                <span style={{ fontSize: 32, fontWeight: 700, color: TEXT, lineHeight: 1 }}>{c.officialPct.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 24 }} />
      </div>
    ),
    { ...size }
  );
}
