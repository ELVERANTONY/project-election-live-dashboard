"use client";

import { useElectoralData } from "@/lib/useElectoralData";
import { LiveStatus } from "./LiveStatus";
import { KeikoBanner } from "./KeikoBanner";
import { GapHero } from "./GapHero";
import { VoteProgressBar } from "./VoteProgressBar";
import { CandidateCard } from "./CandidateCard";
import { MetricsRow } from "./MetricsRow";
import { DepartamentosTable } from "./DepartamentosTable";
import { VoiceAlertManager } from "./VoiceAlertManager";

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

  const [aliaga, sanchez] = data.contenders;
  // User wants Aliaga always first (left) regardless of rank
  const contenders = [aliaga, sanchez];

  return (
    <>
      <LiveStatus lastSync={data.lastSync} actasProcessed={data.actasProcessed} isFinal={isFinal} />

      <KeikoBanner keiko={data.keiko} />

      <GapHero
        gapToRunoff={data.gapToRunoff}
        secondPlace={data.secondPlace}
        aliagaLeadingSanchez={data.aliagaLeadingSanchez}
        actasProcessed={data.actasProcessed}
        isFinal={isFinal}
        aliagaProbability={data.aliagaProbability}
        requiredRemainingShare={data.requiredRemainingShare}
      />

      <VoteProgressBar aliaga={aliaga} sanchez={sanchez} />

      <section className="mb-12 lg:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {contenders.map((c, i) => (
            <CandidateCard key={c.id} candidate={c} index={i} />
          ))}
        </div>
      </section>

      <MetricsRow turnout={data.turnout} projectedRemaining={data.projectedRemaining} />

      <section className="mb-12 lg:mb-16">
        <DepartamentosTable />
      </section>

      <VoiceAlertManager data={data} />
    </>
  );
}
