"use client";

import { useCountUp } from "@/lib/useCountUp";
import { CandidateId } from "@/types/electoral";

interface GapHeroProps {
  gapToRunoff: number;
  secondPlace: CandidateId;
  aliagaLeadingSanchez: boolean;
  actasProcessed: number;
  isFinal: boolean;
  aliagaProbability: number;
  requiredRemainingShare: number;
}

export function GapHero({ 
  gapToRunoff, 
  secondPlace, 
  aliagaLeadingSanchez, 
  actasProcessed, 
  isFinal,
  aliagaProbability,
  requiredRemainingShare
}: GapHeroProps) {
  const animatedGap = useCountUp(gapToRunoff);
  const remaining = (100 - actasProcessed).toFixed(1);

  if (isFinal) {
    const winnerId = secondPlace;
    const runnerUpId = winnerId === "aliaga" ? "sanchez" : "aliaga";
    
    return (
      <section
        className="mb-10 animate-fade-up"
        style={{ animationDelay: "0.1s" }}
        data-testid="gap-hero"
      >
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 font-label text-[10px] uppercase tracking-widest font-bold rounded-full">
              Resultados Finales — 100% Actas
            </span>
          </div>

          <div className="font-headline text-[2.5rem] lg:text-[4rem] font-bold leading-none tracking-tighter text-on-surface">
            <span className={winnerId === "aliaga" ? "text-secondary" : "text-tertiary"}>
              {winnerId === "aliaga" ? "López Aliaga" : "Sánchez"}
            </span> pasa a segunda vuelta
          </div>

          <div className="font-body text-lg font-light text-on-surface-variant leading-tight">
            <span className={`font-bold ${winnerId === "aliaga" ? "text-secondary" : "text-tertiary"}`}>
              {winnerId === "aliaga" ? "Rafael López Aliaga" : "Sánchez"}
            </span> terminó en <span className="font-bold text-primary">2do lugar</span> y enfrentará a <span className="font-bold">Keiko</span>.
          </div>

          <div className="flex flex-wrap gap-4 mt-1 font-body text-sm text-on-surface-variant/70">
            <span>
              Superó a <span className={`font-bold ${runnerUpId === "aliaga" ? "text-secondary" : "text-tertiary"}`}>
                {runnerUpId === "aliaga" ? "Aliaga" : "Sánchez"}
              </span> por <span className="font-bold">{gapToRunoff.toLocaleString("es-PE")}</span> votos.
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="mb-10 animate-fade-up"
      style={{ animationDelay: "0.1s" }}
      data-testid="gap-hero"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-primary-container text-on-primary-container font-label text-[10px] uppercase tracking-widest font-bold rounded-full">
            Actas restantes: {remaining}%
          </span>
          <span className="px-4 py-1.5 border border-outline-variant/30 font-label text-[10px] uppercase tracking-widest font-bold rounded-full text-on-surface-variant">
            Disputa por el 2do lugar
          </span>
        </div>

        <p className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">
          {aliagaLeadingSanchez ? "Aliaga supera a Sánchez por" : "A Aliaga le falta superar a Sánchez por"}
        </p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-x-12 gap-y-4 w-full">
          <div
            className="font-headline text-[4rem] lg:text-[6rem] font-bold leading-none tracking-tighter tabular-nums text-on-surface odometer"
            data-testid="gap-number"
          >
            {animatedGap.toLocaleString("es-PE")}
          </div>

          {!isFinal && !aliagaLeadingSanchez && (
            <div className="group relative flex flex-col gap-1 pb-2 border-l border-outline-variant/30 pl-8 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                  Probabilidad de Remontada
                </span>
                <div className="cursor-help text-on-surface-variant/40 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-sm leading-none">info</span>
                  <div className="absolute left-8 top-6 z-50 w-64 p-4 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none">
                    <p className="font-label text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Motor Estadístico</p>
                    <p className="font-body text-[11px] text-on-surface-variant leading-relaxed">
                      Calculado mediante una <strong>Distribución Normal (Z-Score)</strong>. Considera el volumen de votos en el <strong>{remaining}% de actas restantes</strong> y la volatilidad histórica para proyectar si Aliaga puede capturar el <strong>{requiredRemainingShare}%</strong> necesario para empatar.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`font-headline text-4xl font-black ${
                  aliagaProbability > 60 ? "text-emerald-400" : 
                  aliagaProbability > 30 ? "text-amber-400" : "text-red-400"
                }`}>
                  {aliagaProbability}%
                </span>
                <span className="font-label text-[10px] text-on-surface-variant opacity-60 uppercase">
                  {aliagaProbability > 60 ? "Alta" : aliagaProbability > 30 ? "Media" : "Baja"}
                </span>
              </div>
              <p className="font-body text-[11px] text-on-surface-variant/80 mt-1">
                Aliaga necesita capturar el <span className="font-bold text-on-surface">{requiredRemainingShare}%</span> de votos restantes entre ambos.
              </p>
            </div>
          )}
        </div>

        <div className="font-body text-xl font-light text-on-surface-variant leading-tight mt-1">
          {aliagaLeadingSanchez ? (
            <>
              <span className="font-bold text-secondary">López Aliaga</span> mantiene su ventaja crítica sobre{" "}
              <span className="font-bold text-tertiary">Sánchez</span> para entrar a{" "}
              <span className="font-bold text-primary">segunda vuelta</span>.
            </>
          ) : (
            <>
              <span className="font-bold text-secondary">Rafael López Aliaga</span> necesita recortar una distancia de{" "}
              <span className="font-bold text-primary">{animatedGap.toLocaleString("es-PE")} votos</span> para recuperar el cupo al balotaje.
            </>
          )}
        </div>
      </div>
    </section>
  );
}
