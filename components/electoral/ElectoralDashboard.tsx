"use client";

import { useElectoralData } from "@/lib/useElectoralData";
import { LiveStatus } from "./LiveStatus";
import { KeikoBanner } from "./KeikoBanner";
import { GapHero } from "./GapHero";
import { VoteProgressBar } from "./VoteProgressBar";
import { CandidateCard } from "./CandidateCard";
import { MetricsRow } from "./MetricsRow";
import { FlashAlert } from "./FlashAlert";
import { DepartamentosTable } from "./DepartamentosTable";

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

  const [aliaga, nieto, sanchez] = data.contenders;
  const sortedContenders = [aliaga, nieto, sanchez].sort((a, b) => b.votes - a.votes);

  return (
    <>
      <LiveStatus lastSync={data.lastSync} actasProcessed={data.actasProcessed} />

      <KeikoBanner keiko={data.keiko} />

      <GapHero
        gapToRunoff={data.gapToRunoff}
        gap34={data.gap34}
        secondPlace={data.secondPlace}
        sanchezLeading={data.sanchezLeading}
        actasProcessed={data.actasProcessed}
      />

      <VoteProgressBar aliaga={aliaga} nieto={nieto} sanchez={sanchez} />

      <section className="mb-12 lg:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContenders.map((c, i) => (
            <CandidateCard key={c.id} candidate={c} index={i} />
          ))}
        </div>
      </section>

      <MetricsRow turnout={data.turnout} projectedRemaining={data.projectedRemaining} />

      <section className="mb-12 lg:mb-16">
        <DepartamentosTable />
      </section>

      <FlashAlert gapToRunoff={data.gapToRunoff} secondPlace={data.secondPlace} />
    </>
  );
}
