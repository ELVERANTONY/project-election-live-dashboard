"use client";

import { useCountUp } from "@/lib/useCountUp";

interface GapHeroProps {
  gap: number;
  actasProcessed: number;
  challengerName: string;
  leaderName: string;
  nietoLeading?: boolean;
}

export function GapHero({ gap, actasProcessed, challengerName, leaderName, nietoLeading = false }: GapHeroProps) {
  const animatedGap = useCountUp(gap);
  const remaining = (100 - actasProcessed).toFixed(1);

  return (
    <section
      className="mb-12 lg:mb-16 animate-fade-up"
      style={{ animationDelay: "0.1s" }}
      data-testid="gap-hero"
    >
      <div className="flex flex-col items-start gap-2">
        <span className="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container font-label text-[10px] uppercase tracking-widest font-bold rounded-full">
          Actas restantes: {remaining}%
        </span>
        <p className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
          Diferencia actual
        </p>
        <div
          className="font-headline text-[4rem] lg:text-[6rem] font-bold leading-none tracking-tighter tabular-nums text-on-surface odometer"
          data-testid="gap-number"
        >
          {animatedGap.toLocaleString("es-PE")}
        </div>
        {nietoLeading ? (
          <div className="font-body text-xl font-light text-on-surface-variant leading-tight mt-1">
            <span className="font-bold text-primary">{challengerName}</span> supera a{" "}
            <span className="font-bold text-secondary">{leaderName}</span> por{" "}
            <span className="font-bold text-primary">{gap.toLocaleString("es-PE")}</span> votos.
          </div>
        ) : (
          <div className="font-body text-xl font-light text-on-surface-variant leading-tight mt-1">
            A{" "}
            <span className="font-bold text-primary">{challengerName}</span> le
            faltan{" "}
            <span className="font-bold text-primary">{gap.toLocaleString("es-PE")}</span>{" "}
            votos para pasarlo al{" "}
            <span className="font-bold text-secondary">{leaderName}</span>.
          </div>
        )}
      </div>
    </section>
  );
}
