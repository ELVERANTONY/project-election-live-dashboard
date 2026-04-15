import { CandidateId, ElectoralData } from "@/types/electoral";

const ONPE = "https://resultadoelectoral.onpe.gob.pe/presentacion-backend";
const HEADERS = {
  Referer: "https://resultadoelectoral.onpe.gob.pe/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
};

const KEIKO_CODE   = 8;
const ALIAGA_CODE  = 35;
const NIETO_CODE   = 16;
const SANCHEZ_CODE = 10;

type ONPECandidate = {
  codigoAgrupacionPolitica: number;
  nombreAgrupacionPolitica: string;
  nombreCandidato: string;
  dniCandidato: string;
  totalVotosValidos: number;
  porcentajeVotosValidos: number;
};

export async function fetchElectoralData(): Promise<ElectoralData> {
  const [candRes, totRes] = await Promise.all([
    fetch(
      `${ONPE}/resumen-general/participantes?idEleccion=10&tipoFiltro=eleccion`,
      { headers: HEADERS, cache: "no-store" }
    ),
    fetch(
      `${ONPE}/resumen-general/totales?idEleccion=10&tipoFiltro=eleccion`,
      { headers: HEADERS, cache: "no-store" }
    ),
  ]);

  if (!candRes.ok || !totRes.ok) {
    throw new Error(`ONPE responded ${candRes.status} / ${totRes.status}`);
  }

  const candCT = candRes.headers.get("content-type") ?? "";
  const totCT = totRes.headers.get("content-type") ?? "";
  if (!candCT.includes("application/json") || !totCT.includes("application/json")) {
    throw new Error(
      `ONPE API devolvió HTML en lugar de JSON (content-type: ${candCT}). El endpoint puede haber cambiado o requiere autenticación.`
    );
  }

  const [candJson, totJson] = await Promise.all([
    candRes.json(),
    totRes.json(),
  ]);

  const list = candJson.data as ONPECandidate[];

  function find(code: number) {
    const c = list.find((x) => x.codigoAgrupacionPolitica === code);
    if (!c) throw new Error(`Candidate code ${code} not found`);
    return c;
  }

  const rawKeiko   = find(KEIKO_CODE);
  const rawAliaga  = find(ALIAGA_CODE);
  const rawNieto   = find(NIETO_CODE);
  const rawSanchez = find(SANCHEZ_CODE);

  const aliagaVotes  = rawAliaga.totalVotosValidos;
  const nietoVotes   = rawNieto.totalVotosValidos;
  const sanchezVotes = rawSanchez.totalVotosValidos;
  const threeTotal   = aliagaVotes + nietoVotes + sanchezVotes;

  function sharePct(v: number) {
    return +((v / threeTotal) * 100).toFixed(2);
  }

  const gap23 = aliagaVotes - nietoVotes;
  const gap34 = nietoVotes - sanchezVotes;

  const sorted = [
    { id: "aliaga"  as CandidateId, votes: aliagaVotes  },
    { id: "nieto"   as CandidateId, votes: nietoVotes   },
    { id: "sanchez" as CandidateId, votes: sanchezVotes },
  ].sort((a, b) => b.votes - a.votes);

  const rankOf: Record<CandidateId, 2 | 3 | 4> = {
    [sorted[0].id]: 2,
    [sorted[1].id]: 3,
    [sorted[2].id]: 4,
  } as Record<CandidateId, 2 | 3 | 4>;

  const nietoIdx = sorted.findIndex((x) => x.id === "nieto");
  const secondPlace: CandidateId = nietoIdx <= 1 ? "nieto" : sorted[1].id;
  const gapToRunoff = nietoIdx <= 1 ? 0 : sorted[1].votes - nietoVotes;

  const totals = totJson.data;
  const lastSync =
    new Date(totals.fechaActualizacion).toLocaleTimeString("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " PET";

  return {
    keiko: {
      votes: rawKeiko.totalVotosValidos,
      officialPct: rawKeiko.porcentajeVotosValidos,
    },
    contenders: [
      {
        id: "aliaga",
        rank: rankOf["aliaga"],
        name: "López Aliaga",
        party: rawAliaga.nombreAgrupacionPolitica,
        votes: aliagaVotes,
        officialPct: rawAliaga.porcentajeVotosValidos,
        sharePct: sharePct(aliagaVotes),
        imageUrl: `/api/candidato-img/${rawAliaga.dniCandidato}`,
        imageAlt: rawAliaga.nombreCandidato,
      },
      {
        id: "nieto",
        rank: rankOf["nieto"],
        name: "Nieto",
        party: rawNieto.nombreAgrupacionPolitica,
        votes: nietoVotes,
        officialPct: rawNieto.porcentajeVotosValidos,
        sharePct: sharePct(nietoVotes),
        imageUrl: `/api/candidato-img/${rawNieto.dniCandidato}`,
        imageAlt: rawNieto.nombreCandidato,
      },
      {
        id: "sanchez",
        rank: rankOf["sanchez"],
        name: "Sánchez",
        party: rawSanchez.nombreAgrupacionPolitica,
        votes: sanchezVotes,
        officialPct: rawSanchez.porcentajeVotosValidos,
        sharePct: sharePct(sanchezVotes),
        imageUrl: `/api/candidato-img/${rawSanchez.dniCandidato}`,
        imageAlt: rawSanchez.nombreCandidato,
      },
    ],
    gap23: Math.abs(gap23),
    gap34: Math.abs(gap34),
    gapToRunoff,
    secondPlace,
    nietoLeading: gap23 < 0,
    sanchezLeading: gap34 < 0,
    actasProcessed: totals.actasContabilizadas,
    lastSync,
    turnout: totals.participacionCiudadana,
    projectedRemaining: Math.max(0, totals.totalActas - totals.contabilizadas),
  };
}
