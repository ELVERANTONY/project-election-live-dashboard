import { CandidateId } from "@/types/electoral";

interface FlashAlertProps {
  gapToRunoff: number;
  secondPlace: CandidateId;
  isFinal: boolean;
}

export function FlashAlert({ gapToRunoff, secondPlace, isFinal }: FlashAlertProps) {
  if (isFinal) {
    const winnerName = secondPlace === "aliaga" ? "Rafael López Aliaga" : "Sánchez";
    const message = `${winnerName} consolidó su paso a segunda vuelta. El escrutinio ha concluido oficialmente.`;

    return (
      <div
        className="hidden lg:flex fixed bottom-10 right-10 z-[100] glass-panel p-6 rounded-sm border border-emerald-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] items-center gap-5 max-w-sm animate-slide-in-right overflow-hidden group"
        style={{ animationDelay: "0.8s" }}
        data-testid="flash-alert"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
        <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10">
          <span className="material-symbols-outlined text-emerald-400 text-3xl">
            verified
          </span>
        </div>
        <div>
          <h4 className="text-emerald-400 font-headline font-black uppercase text-xs tracking-[0.2em]">
            Resultados Finales
          </h4>
          <p className="text-[13px] text-on-surface leading-snug mt-1 font-medium italic opacity-90">
            {message}
          </p>
        </div>
      </div>
    );
  }

  const leaderName = secondPlace === "aliaga" ? "Aliaga" : "Sánchez";
  const rivalName = secondPlace === "aliaga" ? "Sánchez" : "Aliaga";
  const message = `${leaderName} mantiene una ventaja crítica de ${gapToRunoff.toLocaleString("es-PE")} votos sobre ${rivalName}.`;

  return (
    <div
      className="hidden lg:flex fixed bottom-10 right-10 z-[100] glass-panel p-6 rounded-sm border border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] items-center gap-5 max-w-sm animate-slide-in-right overflow-hidden group"
      style={{ animationDelay: "0.8s" }}
      data-testid="flash-alert"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        <span className="material-symbols-outlined text-primary text-3xl">
          campaign
        </span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
      </div>
      <div>
        <h4 className="text-on-surface font-headline font-black uppercase text-xs tracking-[0.2em]">
          Flash Electoral
        </h4>
        <p className="text-[13px] text-on-surface-variant leading-snug mt-1 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
