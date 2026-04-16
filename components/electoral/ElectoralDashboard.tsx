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
  const { data, loading, error, isFinal } = useElectoralData();

  if (loading && !data) {
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

  if (!data && error) {
    return (
      <div
        data-testid="error-state"
        className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4"
      >
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
          Datos ONPE no disponibles
        </p>
        <p className="font-body text-xs text-on-surface-variant max-w-sm opacity-60">
          El servicio de ONPE no responde correctamente. Reintentando cada 30 segundos.
        </p>
      </div>
    );
  }

  if (!data) return null;

  const [aliaga, nieto, sanchez] = data.contenders;
  const sortedContenders = [aliaga, nieto, sanchez].sort((a, b) => b.votes - a.votes);

  return (
    <>
      <LiveStatus lastSync={data.lastSync} actasProcessed={data.actasProcessed} isFinal={isFinal} />

      <KeikoBanner keiko={data.keiko} />

      <GapHero
        gapToRunoff={data.gapToRunoff}
        gap23={data.gap23}
        gap24={data.gap24}
        gap34={data.gap34}
        secondPlace={data.secondPlace}
        sanchezLeading={data.sanchezLeading}
        aliagaLeadingSanchez={data.aliagaLeadingSanchez}
        actasProcessed={data.actasProcessed}
        isFinal={isFinal}
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

      <FlashAlert gapToRunoff={data.gapToRunoff} secondPlace={data.secondPlace} isFinal={isFinal} />
    </>
  );
}
