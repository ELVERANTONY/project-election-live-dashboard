import { ImageResponse } from "next/og";
import { fetchElectoralData } from "@/lib/electoral";

export const alt = "¿Nieto pasa a Aliaga? | Primera Vuelta 2026";
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
            width: "100%", height: "100%", background: BG,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 12, fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: 48, color: TEXT, fontWeight: 700 }}>¿Nieto pasa a Aliaga?</span>
          <span style={{ fontSize: 20, color: MUTED }}>Primera Vuelta 2026 · En vivo</span>
        </div>
      ),
      { ...size }
    );
  }

  const [aliaga, nieto, sanchez] = data.contenders;

  // Extract DNIs from imageUrl (/api/candidato-img/{dni})
  const aliagaDni  = aliaga.imageUrl.split("/").pop() ?? "";
  const nietoDni   = nieto.imageUrl.split("/").pop() ?? "";
  const sanchezDni = sanchez.imageUrl.split("/").pop() ?? "";

  const [aliagaImg, nietoImg, sanchezImg] = await Promise.all([
    fetchPhotoDataUrl(aliagaDni),
    fetchPhotoDataUrl(nietoDni),
    fetchPhotoDataUrl(sanchezDni),
  ]);

  const BAR_W    = 1104;
  const barTotal = aliaga.votes + nieto.votes + sanchez.votes;
  const aliagaW  = Math.round((aliaga.votes  / barTotal) * BAR_W);
  const nietoW   = Math.round((nieto.votes   / barTotal) * BAR_W);
  const sanchezW = BAR_W - aliagaW - nietoW;

  const secondPlace = data.secondPlace;
  const gapColor  = secondPlace === "nieto" ? GREEN : TEXT;
  const gapPrefix = secondPlace === "nieto" ? "−" : "+";
  const gapLabel  = secondPlace === "nieto"   ? "Nieto supera a Aliaga por"
                  : secondPlace === "sanchez" ? "Le faltan a Nieto"
                  :                             "Le faltan a Nieto";
  const gapSub    = secondPlace === "nieto"   ? "votos · pasaría a segunda vuelta"
                  : secondPlace === "sanchez" ? "votos para superar a Sánchez"
                  :                             "votos para superar a López Aliaga";

  const accentOf = { aliaga: GRAY, nieto: BLUE, sanchez: CORAL } as const;
  const rankLabelOf = { 2: "2DO LUGAR", 3: "3ER LUGAR", 4: "4TO LUGAR" } as const;

  const candidates = [aliaga, nieto, sanchez].map((c, i) => ({
    c,
    img: [aliagaImg, nietoImg, sanchezImg][i],
    rankLabel: rankLabelOf[c.rank as 2 | 3 | 4],
    accent: accentOf[c.id as "aliaga" | "nieto" | "sanchez"],
    cardBg: c.id === "nieto" ? BLUE_DK : CARD,
    highlight: c.id === "nieto",
  }));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: BG, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "0 48px", height: 52, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 24, marginRight: 10 }}>🌞</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>¿Nieto pasa a Aliaga?</span>
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
          <div style={{ width: 6, height: 6, borderRadius: 999, background: BLUE, marginRight: 10 }} />
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 48px 8px", height: 160 }}>
          <div style={{ display: "flex", alignItems: "center", background: "#631200", borderRadius: 3, padding: "3px 12px", marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: CORAL, letterSpacing: 2, textTransform: "uppercase" }}>
              Actas contabilizadas: {data.actasProcessed.toFixed(3)}%
            </span>
          </div>
          <span style={{ fontSize: 13, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{gapLabel}</span>
          <span style={{ fontSize: 76, fontWeight: 700, color: gapColor, lineHeight: 1 }}>
            {gapPrefix}{fmt(data.gapToRunoff)}
          </span>
          <span style={{ fontSize: 14, color: MUTED, marginTop: 8 }}>{gapSub}</span>
          <span style={{ fontSize: 12, color: CORAL, marginTop: 6 }}>
            {data.sanchezLeading
              ? `Sánchez supera a Nieto por +${fmt(data.gap34)} votos`
              : `Nieto le lleva +${fmt(data.gap34)} votos a Sánchez`}
          </span>
        </div>

        {/* Vote bar */}
        <div style={{ display: "flex", flexDirection: "column", padding: "0 48px", marginBottom: 6 }}>
          <div style={{ display: "flex", flexDirection: "row", height: 12, overflow: "hidden" }}>
            <div style={{ width: aliagaW,  height: 12, background: GRAY  }} />
            <div style={{ width: 2,        height: 12, background: BG    }} />
            <div style={{ width: nietoW,   height: 12, background: BLUE  }} />
            <div style={{ width: 2,        height: 12, background: BG    }} />
            <div style={{ width: sanchezW, height: 12, background: CORAL }} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
            <span style={{ fontSize: 11, color: GRAY,  width: aliagaW  }}>López Aliaga {aliaga.officialPct.toFixed(2)}%</span>
            <span style={{ fontSize: 11, color: BLUE,  width: nietoW,   textAlign: "center" }}>Nieto {nieto.officialPct.toFixed(2)}%</span>
            <span style={{ fontSize: 11, color: CORAL, flex: 1,         textAlign: "right"  }}>Sánchez {sanchez.officialPct.toFixed(2)}%</span>
          </div>
        </div>

        {/* Candidate cards */}
        <div style={{ display: "flex", flexDirection: "row", padding: "0 48px", gap: 10, flex: 1 }}>
          {candidates.map(({ c, img, rankLabel, accent, cardBg, highlight }) => (
            <div
              key={c.id}
              style={{
                flex: 1,
                background: cardBg,
                border: `1px solid ${highlight ? accent : BORDER}`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 3,
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
              }}
            >
              {/* Photo */}
              <div style={{ width: 80, flexShrink: 0, background: "#0a0f14", overflow: "hidden", display: "flex" }}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={c.name}
                    width={80}
                    height={200}
                    style={{
                      width: 80,
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top",
                      filter: highlight ? "none" : "grayscale(100%)",
                    }}
                  />
                ) : (
                  <div style={{ width: 80, height: "100%", background: accent + "22" }} />
                )}
              </div>

              {/* Data */}
              <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: 9, color: accent, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>{rankLabel}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", marginBottom: 6 }}>{c.name}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1, marginBottom: 4 }}>{c.officialPct.toFixed(2)}%</span>
                <span style={{ fontSize: 10, color: MUTED }}>{fmt(c.votes)} votos</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom padding */}
        <div style={{ height: 14 }} />
      </div>
    ),
    { ...size }
  );
}
