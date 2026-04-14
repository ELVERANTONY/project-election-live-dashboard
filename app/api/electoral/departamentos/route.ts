import { NextResponse } from "next/server";
import { DepartamentosData, DepartmentRow } from "@/types/electoral";

const ONPE = "https://resultadoelectoral.onpe.gob.pe/presentacion-backend";
const HEADERS = {
  Referer: "https://resultadoelectoral.onpe.gob.pe/",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Accept: "application/json, text/plain, */*",
};

const ALIAGA_CODE  = 35;
const NIETO_CODE   = 16;
const SANCHEZ_CODE = 10;

// ONPE ubigeo codes (differ from INEI — Callao is 240000, rest shifted)
const DEPARTMENTS: { name: string; ubigeo: string }[] = [
  { name: "Amazonas",      ubigeo: "010000" },
  { name: "Áncash",        ubigeo: "020000" },
  { name: "Apurímac",      ubigeo: "030000" },
  { name: "Arequipa",      ubigeo: "040000" },
  { name: "Ayacucho",      ubigeo: "050000" },
  { name: "Cajamarca",     ubigeo: "060000" },
  { name: "Callao",        ubigeo: "240000" },
  { name: "Cusco",         ubigeo: "070000" },
  { name: "Huancavelica",  ubigeo: "080000" },
  { name: "Huánuco",       ubigeo: "090000" },
  { name: "Ica",           ubigeo: "100000" },
  { name: "Junín",         ubigeo: "110000" },
  { name: "La Libertad",   ubigeo: "120000" },
  { name: "Lambayeque",    ubigeo: "130000" },
  { name: "Lima",          ubigeo: "140000" },
  { name: "Loreto",        ubigeo: "150000" },
  { name: "Madre de Dios", ubigeo: "160000" },
  { name: "Moquegua",      ubigeo: "170000" },
  { name: "Pasco",         ubigeo: "180000" },
  { name: "Piura",         ubigeo: "190000" },
  { name: "Puno",          ubigeo: "200000" },
  { name: "San Martín",    ubigeo: "210000" },
  { name: "Tacna",         ubigeo: "220000" },
  { name: "Tumbes",        ubigeo: "230000" },
  { name: "Ucayali",       ubigeo: "250000" },
];

type ONPEParticipant = {
  codigoAgrupacionPolitica: number;
  totalVotosValidos: number;
  porcentajeVotosValidos: number;
};

async function fetchDept(ubigeo: string): Promise<ONPEParticipant[]> {
  const url = `${ONPE}/resumen-general/participantes?idEleccion=10&tipoFiltro=ubigeo_nivel_01&idAmbitoGeografico=1&idUbigeoDepartamento=${ubigeo}`;
  const res = await fetch(url, { headers: HEADERS, cache: "no-store" });
  if (!res.ok) throw new Error(`ONPE ${ubigeo} → ${res.status}`);
  const json = await res.json();
  return json.data as ONPEParticipant[];
}

export async function GET() {
  try {
    const results = await Promise.all(
      DEPARTMENTS.map(async (dept) => {
        const participants = await fetchDept(dept.ubigeo);
        const find = (code: number) =>
          participants.find((p) => p.codigoAgrupacionPolitica === code);
        const aliaga  = find(ALIAGA_CODE);
        const nieto   = find(NIETO_CODE);
        const sanchez = find(SANCHEZ_CODE);
        const row: DepartmentRow = {
          ubigeo: dept.ubigeo,
          name: dept.name,
          aliagaPct:    aliaga?.porcentajeVotosValidos  ?? 0,
          nietoPct:     nieto?.porcentajeVotosValidos   ?? 0,
          sanchezPct:   sanchez?.porcentajeVotosValidos ?? 0,
          aliagaVotes:  aliaga?.totalVotosValidos  ?? 0,
          nietoVotes:   nieto?.totalVotosValidos   ?? 0,
          sanchezVotes: sanchez?.totalVotosValidos ?? 0,
        };
        return row;
      })
    );

    const data: DepartamentosData = {
      departments: results,
      lastSync: new Date().toLocaleTimeString("es-PE", {
        timeZone: "America/Lima",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " PET",
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error("[electoral/departamentos]", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
