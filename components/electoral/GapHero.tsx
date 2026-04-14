"use client";

import { useCountUp } from "@/lib/useCountUp";

interface GapHeroProps {
  gap23: number;
  gap34: number;
  nietoLeading: boolean;
  actasProcessed: number;
}

export function GapHero({ gap23, gap34, nietoLeading, actasProcessed }: GapHeroProps) {
  const animatedGap = useCountUp(gap23);
  const remaining = (100 - actasProcessed).toFixed(1);

  return (
    <section
      className="mb-10 animate-fade-up"
      style={{ animationDelay: "0.1s" }}
      data-testid="gap-hero"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container font-label text-[10px] uppercase tracking-widest font-bold rounded-full">
            Actas restantes: {remaining}%
          </span>
          <span className="px-4 py-1.5 border border-outline-variant/30 font-label text-[10px] uppercase tracking-widest font-bold rounded-full text-on-surface-variant">
            Disputa por el 2do lugar
          </span>
        </div>

        <p className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">
          {nietoLeading ? "Nieto supera a Aliaga por" : "Le faltan a Nieto"}
        </p>

        <div
          className="font-headline text-[4rem] lg:text-[6rem] font-bold leading-none tracking-tighter tabular-nums text-on-surface odometer"
          data-testid="gap-number"
        >
          {animatedGap.toLocaleString("es-PE")}
        </div>

        <div className="font-body text-xl font-light text-on-surface-variant leading-tight mt-1">
          {nietoLeading ? (
            <>
              <span className="font-bold text-primary">Nieto</span> supera a{" "}
              <span className="font-bold text-secondary">López Aliaga</span> y{" "}
              <span className="font-bold text-primary">pasaría a segunda vuelta</span>.
            </>
          ) : (
            <>
              <span className="font-bold text-primary">Nieto</span> necesita{" "}
              <span className="font-bold text-primary">{gap23.toLocaleString("es-PE")}</span>{" "}
              votos para superar a{" "}
              <span className="font-bold text-secondary">López Aliaga</span> y pasar a segunda vuelta.
            </>
          )}
        </div>

        <div className="font-body text-sm text-on-surface-variant/70 mt-0.5">
          Nieto le lleva{" "}
          <span className="font-bold text-tertiary">{gap34.toLocaleString("es-PE")}</span>{" "}
          votos a <span className="font-bold text-tertiary">Sánchez</span>.
        </div>
      </div>
    </section>
  );
}
