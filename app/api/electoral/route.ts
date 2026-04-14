import { NextResponse } from "next/server";

const ONPE = "https://resultadoelectoral.onpe.gob.pe/presentacion-backend";
const HEADERS = {
  Referer: "https://resultadoelectoral.onpe.gob.pe/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Accept: "application/json, text/plain, */*",
};

// Nieto = party code 16, Aliaga = party code 35
const NIETO_CODE = "16";
const ALIAGA_CODE = "35";

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

    const list = candJson.data as Array<{
      codigoAgrupacionPolitica: string;
      nombreAgrupacionPolitica: string;
      nombreCandidato: string;
      dniCandidato: string;
      totalVotosValidos: number;
      porcentajeVotosValidos: number;
    }>;

    const raw_nieto = list.find((c) => c.codigoAgrupacionPolitica === NIETO_CODE);
    const raw_aliaga = list.find((c) => c.codigoAgrupacionPolitica === ALIAGA_CODE);

    if (!raw_nieto || !raw_aliaga) throw new Error("Candidates not found in ONPE response");

    const nVotos = raw_nieto.totalVotosValidos;
    const aVotos = raw_aliaga.totalVotosValidos;
    const total2 = nVotos + aVotos;

    // Percentage as share between the two so bars look good
    const nPct = +((nVotos / total2) * 100).toFixed(2);
    const aPct = +((aVotos / total2) * 100).toFixed(2);

    const gap = aVotos - nVotos; // positive = Aliaga ahead

    const totals = totJson.data;
    const lastSync = new Date(totals.fechaActualizacion).toLocaleTimeString(
      "es-PE",
      { timeZone: "America/Lima", hour: "2-digit", minute: "2-digit", second: "2-digit" }
    ) + " PET";

    return NextResponse.json({
      candidates: [
        {
          id: "nieto",
          name: "Nieto",
          party: raw_nieto.nombreAgrupacionPolitica,
          votes: nVotos,
          percentage: nPct,
          role: gap > 0 ? "challenger" : "leader",
          imageUrl: `/api/candidato-img/${raw_nieto.dniCandidato}`,
          imageAlt: raw_nieto.nombreCandidato,
        },
        {
          id: "aliaga",
          name: "López Aliaga",
          party: raw_aliaga.nombreAgrupacionPolitica,
          votes: aVotos,
          percentage: aPct,
          role: gap > 0 ? "leader" : "challenger",
          imageUrl: `/api/candidato-img/${raw_aliaga.dniCandidato}`,
          imageAlt: raw_aliaga.nombreCandidato,
        },
      ],
      gap: Math.abs(gap),
      nietoLeading: gap < 0,
      actasProcessed: totals.actasContabilizadas,
      lastSync,
      turnout: totals.participacionCiudadana,
      projectedRemaining: totals.totalActas - totals.contabilizadas,
      districts: [],
    });
  } catch (err) {
    console.error("[electoral/route]", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 502 }
    );
  }
}
