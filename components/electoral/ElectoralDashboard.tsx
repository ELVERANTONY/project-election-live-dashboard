"use client";

import { useElectoralData } from "@/lib/useElectoralData";
import { LiveStatus } from "./LiveStatus";
import { GapHero } from "./GapHero";
import { VoteProgressBar } from "./VoteProgressBar";
import { CandidateCard } from "./CandidateCard";
import { DistrictTicker } from "./DistrictTicker";
import { MetricsRow } from "./MetricsRow";
import { FlashAlert } from "./FlashAlert";

export function ElectoralDashboard() {
  const { data, loading } = useElectoralData();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="font-label text-xs uppercase tracking-widest">
            Cargando datos ONPE...
          </span>
        </div>
      </div>
    );
  }

  const [nieto, aliaga] = data.candidates;
  const { gap, actasProcessed, lastSync, districts, nietoLeading } = data;

  const flashMsg = nietoLeading
    ? `Nieto supera a López Aliaga por ${gap.toLocaleString("es-PE")} votos.`
    : `Le faltan ${gap.toLocaleString("es-PE")} votos para superar al chancho.`;

  return (
    <>
      <LiveStatus lastSync={lastSync} actasProcessed={actasProcessed} />

      <GapHero
        gap={gap}
        actasProcessed={actasProcessed}
        challengerName={nieto.name}
        leaderName={aliaga.name}
        nietoLeading={nietoLeading}
      />

      <VoteProgressBar nieto={nieto} aliaga={aliaga} />

      <section className="mb-12 lg:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CandidateCard candidate={nieto} index={0} />
          <CandidateCard candidate={aliaga} index={1} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <MetricsRow
            turnout={data.turnout}
            projectedRemaining={data.projectedRemaining}
          />
        </div>
        {districts.length > 0 && (
          <div>
            <DistrictTicker districts={districts} />
          </div>
        )}
      </div>

      <FlashAlert message={flashMsg} />
    </>
  );
}
