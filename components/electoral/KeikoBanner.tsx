import { KeikoData } from "@/types/electoral";

interface KeikoBannerProps {
  keiko: KeikoData;
}

export function KeikoBanner({ keiko }: KeikoBannerProps) {
  return (
    <div
      className="mb-8 flex items-center justify-between px-5 py-3 bg-surface-container border border-outline-variant/20 rounded-sm animate-fade-up"
      data-testid="keiko-banner"
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-on-primary-fixed-variant shrink-0" />
        <div>
          <span className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
            1er lugar — clasificada a segunda vuelta
          </span>
          <p className="font-headline text-sm font-bold text-on-surface uppercase tracking-tight">
            Keiko Fujimori
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-headline text-sm font-bold text-on-surface tabular-nums odometer">
          {keiko.votes.toLocaleString("es-PE")} votos
        </p>
        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
          {keiko.officialPct.toFixed(2)}% válidos
        </p>
      </div>
    </div>
  );
}
