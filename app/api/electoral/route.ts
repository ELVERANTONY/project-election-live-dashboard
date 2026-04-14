import { NextResponse } from "next/server";
import { fetchElectoralData } from "@/lib/electoral";

export async function GET() {
  try {
    const data = await fetchElectoralData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[electoral/route]", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
