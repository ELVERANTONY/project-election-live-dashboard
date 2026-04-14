import { NextResponse } from "next/server";

const ONPE = "https://resultadoelectoral.onpe.gob.pe/presentacion-backend";
const HEADERS = {
  Referer: "https://resultadoelectoral.onpe.gob.pe/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Accept: "application/json, text/plain, */*",
};

const KEIKO_CODE   = "8";
const ALIAGA_CODE  = "35";
const NIETO_CODE   = "16";
const SANCHEZ_CODE = "10";

export async function GET() {
  try {
    const [candRes, totRes] = await Promise.all([
      fetch(
        `${ONPE}/eleccion-presidencial/participantes-ubicacion-geografica-nombre?idEleccion=10&tipoFiltro=eleccion`,
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

    const [candJson, totJson] = await Promise.all([
      candRes.json(),
      totRes.json(),
    ]);

    type ONPECandidate = {
      codigoAgrupacionPolitica: string;
      nombreAgrupacionPolitica: string;
      nombreCandidato: string;
      dniCandidato: string;
      totalVotosValidos: number;
      porcentajeVotosValidos: number;
    };

    const list = candJson.data as ONPECandidate[];

    function find(code: string) {
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

    const totals = totJson.data;
    const lastSync =
      new Date(totals.fechaActualizacion).toLocaleTimeString("es-PE", {
        timeZone: "America/Lima",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " PET";

    return NextResponse.json({
      keiko: {
        votes: rawKeiko.totalVotosValidos,
        officialPct: rawKeiko.porcentajeVotosValidos,
      },
      contenders: [
        {
          id: "aliaga",
          rank: 2,
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
          rank: 3,
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
          rank: 4,
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
      nietoLeading: gap23 < 0,
      actasProcessed: totals.actasContabilizadas,
      lastSync,
      turnout: totals.participacionCiudadana,
      projectedRemaining: Math.max(0, totals.totalActas - totals.contabilizadas),
    });
  } catch (err) {
    console.error("[electoral/route]", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
