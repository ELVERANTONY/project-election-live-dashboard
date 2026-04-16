"use client";

import { useCountUp } from "@/lib/useCountUp";
import { CandidateId } from "@/types/electoral";

interface GapHeroProps {
  gapToRunoff: number;
  gap23: number;
  gap24: number;
  gap34: number;
  secondPlace: CandidateId;
  sanchezLeading: boolean;
  aliagaLeadingSanchez: boolean;
  actasProcessed: number;
  isFinal: boolean;
}

export function GapHero({ gapToRunoff, gap23, gap24, gap34, secondPlace, sanchezLeading, aliagaLeadingSanchez, actasProcessed, isFinal }: GapHeroProps) {
  const animatedGap = useCountUp(gapToRunoff);
  const remaining = (100 - actasProcessed).toFixed(1);

  if (isFinal) {
    const nietoPassedRunoff = secondPlace === "nieto";
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
            {nietoPassedRunoff ? (
              <>
                <span className="text-primary">Nieto</span> pasa a segunda vuelta
              </>
            ) : (
              <>
                <span className="text-primary">Nieto</span> no pasa a segunda vuelta
              </>
            )}
          </div>

          <div className="font-body text-lg font-light text-on-surface-variant leading-tight">
            {nietoPassedRunoff ? (
              <>
                <span className="font-bold text-primary">Nieto</span> terminó en{" "}
                <span className="font-bold text-primary">2do lugar</span> y enfrentará a{" "}
                <span className="font-bold">Keiko</span> en segunda vuelta.
              </>
            ) : secondPlace === "sanchez" ? (
              <>
                <span className="font-bold text-tertiary">Sánchez</span> quedó en 2do lugar.{" "}
                <span className="font-bold text-primary">Nieto</span> terminó en{" "}
                <span className="font-bold text-primary">3er lugar</span>.
              </>
            ) : (
              <>
                <span className="font-bold text-secondary">Aliaga</span> quedó en 2do lugar.{" "}
                <span className="font-bold text-primary">Nieto</span> terminó en{" "}
                <span className="font-bold text-primary">3er lugar</span>.
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-1 font-body text-sm text-on-surface-variant/70">
            <span>
              <span className="font-bold text-secondary">Aliaga</span> superó a{" "}
              <span className="font-bold text-primary">Nieto</span> por{" "}
              <span className="font-bold">{gap23.toLocaleString("es-PE")}</span> votos
            </span>
            <span className="text-outline-variant/50">·</span>
            <span>
              {aliagaLeadingSanchez ? (
                <>
                  <span className="font-bold text-secondary">Aliaga</span> superó a{" "}
                  <span className="font-bold text-tertiary">Sánchez</span> por{" "}
                  <span className="font-bold">{gap24.toLocaleString("es-PE")}</span> votos
                </>
              ) : (
                <>
                  <span className="font-bold text-tertiary">Sánchez</span> superó a{" "}
                  <span className="font-bold text-secondary">Aliaga</span> por{" "}
                  <span className="font-bold">{gap24.toLocaleString("es-PE")}</span> votos
                </>
              )}
            </span>
            <span className="text-outline-variant/50">·</span>
            <span>
              {gap34 === 0 ? (
                <>
                  <span className="font-bold text-primary">Nieto</span> y{" "}
                  <span className="font-bold text-tertiary">Sánchez</span> empataron
                </>
              ) : nietoPassedRunoff || !sanchezLeading ? (
                <>
                  <span className="font-bold text-primary">Nieto</span> superó a{" "}
                  <span className="font-bold text-tertiary">Sánchez</span> por{" "}
                  <span className="font-bold">{gap34.toLocaleString("es-PE")}</span> votos
                </>
              ) : (
                <>
                  <span className="font-bold text-tertiary">Sánchez</span> superó a{" "}
                  <span className="font-bold text-primary">Nieto</span> por{" "}
                  <span className="font-bold">{gap34.toLocaleString("es-PE")}</span> votos
                </>
              )}
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
          {secondPlace === "nieto" ? "Nieto supera a Aliaga por" : "Le faltan a Nieto"}
        </p>

        <div
          className="font-headline text-[4rem] lg:text-[6rem] font-bold leading-none tracking-tighter tabular-nums text-on-surface odometer"
          data-testid="gap-number"
        >
          {animatedGap.toLocaleString("es-PE")}
        </div>

        <div className="font-body text-xl font-light text-on-surface-variant leading-tight mt-1">
          {secondPlace === "nieto" ? (
            <>
              <span className="font-bold text-primary">Nieto</span> supera a{" "}
              <span className="font-bold text-secondary">López Aliaga</span> y{" "}
              <span className="font-bold text-primary">pasaría a segunda vuelta</span>.
            </>
          ) : secondPlace === "sanchez" ? (
            <>
              <span className="font-bold text-primary">Nieto</span> necesita{" "}
              <span className="font-bold text-primary">{gapToRunoff.toLocaleString("es-PE")}</span>{" "}
              votos para superar a{" "}
              <span className="font-bold text-tertiary">Sánchez</span> y pasar a segunda vuelta.
            </>
          ) : (
            <>
              <span className="font-bold text-primary">Nieto</span> necesita{" "}
              <span className="font-bold text-primary">{gapToRunoff.toLocaleString("es-PE")}</span>{" "}
              votos para superar a{" "}
              <span className="font-bold text-secondary">López Aliaga</span> y pasar a segunda vuelta.
            </>
          )}
        </div>

        <div className="font-body text-sm text-on-surface-variant/70 mt-0.5">
          {secondPlace === "sanchez" ? (
            <>
              <span className="font-bold text-secondary">Aliaga</span> supera a{" "}
              <span className="font-bold text-primary">Nieto</span> por{" "}
              <span className="font-bold text-secondary">{gap23.toLocaleString("es-PE")}</span> votos.
            </>
          ) : sanchezLeading ? (
            <>
              <span className="font-bold text-tertiary">Sánchez</span> supera a{" "}
              <span className="font-bold text-primary">Nieto</span> por{" "}
              <span className="font-bold text-tertiary">{Math.abs(gap34).toLocaleString("es-PE")}</span> votos.
            </>
          ) : (
            <>
              Nieto le lleva{" "}
              <span className="font-bold text-tertiary">{gap34.toLocaleString("es-PE")}</span>{" "}
              votos a <span className="font-bold text-tertiary">Sánchez</span>.
            </>
          )}
        </div>

        <div className="font-body text-sm text-on-surface-variant/70 mt-0.5">
          {aliagaLeadingSanchez ? (
            <>
              <span className="font-bold text-secondary">Aliaga</span> le lleva{" "}
              <span className="font-bold text-secondary">{gap24.toLocaleString("es-PE")}</span>{" "}
              votos a <span className="font-bold text-tertiary">Sánchez</span>.
            </>
          ) : (
            <>
              <span className="font-bold text-tertiary">Sánchez</span> le lleva{" "}
              <span className="font-bold text-tertiary">{gap24.toLocaleString("es-PE")}</span>{" "}
              votos a <span className="font-bold text-secondary">Aliaga</span>.
            </>
          )}
        </div>
      </div>
    </section>
  );
}
