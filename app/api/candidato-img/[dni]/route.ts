import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ dni: string }> }
) {
  const { dni } = await params;
  const url = `https://resultadoelectoral.onpe.gob.pe/assets/img-reales/candidatos/${dni}.jpg`;

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://resultadoelectoral.onpe.gob.pe/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "no-store",
    });

    if (!res.ok) return new NextResponse(null, { status: 404 });

    const blob = await res.arrayBuffer();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
