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
  const rawSanchez = find(SANCHEZ_CODE);

  const aliagaVotes  = rawAliaga.totalVotosValidos;
  const sanchezVotes = rawSanchez.totalVotosValidos;
  const twoTotal     = aliagaVotes + sanchezVotes;

  function sharePct(v: number) {
    return +((v / twoTotal) * 100).toFixed(2);
  }

  const gapToRunoff = Math.abs(aliagaVotes - sanchezVotes);

  const sorted = [
    { id: "aliaga"  as CandidateId, votes: aliagaVotes  },
    { id: "sanchez" as CandidateId, votes: sanchezVotes },
  ].sort((a, b) => b.votes - a.votes);

  const rankOf: Record<CandidateId, 2 | 3> = {
    [sorted[0].id]: 2,
    [sorted[1].id]: 3,
  } as Record<CandidateId, 2 | 3>;

  const secondPlace: CandidateId = sorted[0].id;

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
    gapToRunoff,
    secondPlace,
    aliagaLeadingSanchez: aliagaVotes > sanchezVotes,
    actasProcessed: totals.actasContabilizadas,
    lastSync,
    turnout: totals.participacionCiudadana,
    projectedRemaining: Math.max(0, totals.totalActas - totals.contabilizadas),
    ...calculateAliagaMetrics(aliagaVotes, sanchezVotes, totals.contabilizadas, totals.totalActas, rawAliaga.porcentajeVotosValidos, rawSanchez.porcentajeVotosValidos),
  };
}

function calculateAliagaMetrics(aliagaVotes: number, sanchezVotes: number, processed: number, total: number, aliagaPct: number, sanchezPct: number) {
  const processedPct = (processed / total) * 100;
  const remainingPct = 100 - processedPct;
  
  if (remainingPct <= 0) {
    return {
      aliagaProbability: aliagaVotes > sanchezVotes ? 100 : 0,
      requiredRemainingShare: 0,
    };
  }

  const gap = sanchezVotes - aliagaVotes;
  const currentTotalContenders = aliagaVotes + sanchezVotes;
  
  // Estimate remaining votes for the Aliaga+Sanchez pool
  // We assume the total valid pool grows proportionally to acts processed
  const projectedTotalContenders = currentTotalContenders / (processedPct / 100);
  const remainingContenders = Math.max(0, projectedTotalContenders - currentTotalContenders);
  
  // What percentage of the REMAINING votes for these two does Aliaga need to tie/win?
  // (Aliaga_rem + Sanchez_rem = remainingContenders)
  // (Aliaga_rem - Sanchez_rem = gap)
  // (2 * Aliaga_rem = remainingContenders + gap)
  const requiredRemainingShare = ((remainingContenders + gap) / (2 * remainingContenders)) * 100;
  
  // Probability Model (Logistic/Sigmoid based on distance to required share)
  // p_curr is Aliaga's current share in the Aliaga+Sanchez pool
  const pCurr = (aliagaVotes / currentTotalContenders) * 100;
  const pReq = requiredRemainingShare;
  
  let probability: number;
  if (pReq > 100) {
    probability = 0; // Mathematically impossible
  } else if (pReq < 0) {
    probability = 100; // Already winning
  } else {
    // Uncertainty factor that narrows as we approach 100%
    // A gap of 1% (in pReq vs pCurr) becomes more "certain" as actasProcessed increases
    const uncertainty = 2.5 * Math.sqrt(remainingPct / 100); 
    const z = (pCurr - pReq) / (uncertainty || 0.1);
    // Sigmoid mapping
    probability = 100 / (1 + Math.exp(-z));
  }

  return {
    aliagaProbability: Math.round(probability),
    requiredRemainingShare: Math.max(0, Math.min(100, Math.round(requiredRemainingShare * 100) / 100)),
  };
}
