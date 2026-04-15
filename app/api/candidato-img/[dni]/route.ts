import { NextResponse } from "next/server";

const cache = new Map<string, { buf: ArrayBuffer; ts: number }>();
const TTL = 60 * 60 * 1000; // 1 hour

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ dni: string }> }
) {
  const { dni } = await params;

  const cached = cache.get(dni);
  if (cached && Date.now() - cached.ts < TTL) {
    return new NextResponse(cached.buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const url = `https://resultadoelectoral.onpe.gob.pe/assets/img-reales/candidatos/${dni}.jpg`;

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://resultadoelectoral.onpe.gob.pe/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      cache: "force-cache",
    });

    if (!res.ok) return new NextResponse(null, { status: 404 });

    const buf = await res.arrayBuffer();
    cache.set(dni, { buf, ts: Date.now() });

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
