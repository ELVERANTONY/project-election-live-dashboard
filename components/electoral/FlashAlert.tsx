import { CandidateId } from "@/types/electoral";

interface FlashAlertProps {
  gapToRunoff: number;
  secondPlace: CandidateId;
  isFinal: boolean;
}

export function FlashAlert({ gapToRunoff, secondPlace, isFinal }: FlashAlertProps) {
  if (isFinal) {
    const nietoPassedRunoff = secondPlace === "nieto";
    const message = nietoPassedRunoff
      ? "Nieto terminó en 2do lugar y pasará a segunda vuelta contra Keiko."
      : secondPlace === "sanchez"
      ? "Sánchez quedó en 2do lugar. Nieto terminó 3ro y no pasa a segunda vuelta."
      : "Aliaga quedó en 2do lugar. Nieto terminó 3ro y no pasa a segunda vuelta.";

    return (
      <div
        className="hidden lg:flex fixed bottom-8 right-8 z-[100] glass-panel p-6 rounded-sm border border-emerald-500/30 shadow-2xl items-center gap-4 max-w-sm animate-slide-in-right"
        style={{ animationDelay: "0.8s" }}
        data-testid="flash-alert"
      >
        <div className="relative shrink-0">
          <span className="material-symbols-outlined text-emerald-400 text-3xl">
            flag
          </span>
        </div>
        <div>
          <h4 className="text-emerald-400 font-headline font-bold uppercase text-sm tracking-widest">
            Resultados Finales
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
            {message}
          </p>
        </div>
      </div>
    );
  }

  const message =
    secondPlace === "nieto"
      ? `Nieto supera a Aliaga por ${gapToRunoff.toLocaleString("es-PE")} votos y pasaría a segunda vuelta.`
      : secondPlace === "sanchez"
      ? `Le faltan ${gapToRunoff.toLocaleString("es-PE")} votos a Nieto para superar a Sánchez y pasar a segunda vuelta.`
      : `Le faltan ${gapToRunoff.toLocaleString("es-PE")} votos a Nieto para pasar a la segunda vuelta.`;

  return (
    <div
      className="hidden lg:flex fixed bottom-8 right-8 z-[100] glass-panel p-6 rounded-sm border border-outline-variant/15 shadow-2xl items-center gap-4 max-w-sm animate-slide-in-right"
      style={{ animationDelay: "0.8s" }}
      data-testid="flash-alert"
    >
      <div className="relative shrink-0">
        <span className="material-symbols-outlined text-primary text-3xl">
          flash_on
        </span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
      </div>
      <div>
        <h4 className="text-on-surface font-headline font-bold uppercase text-sm tracking-widest">
          2da vuelta en juego
        </h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
          {message}
        </p>
      </div>
    </div>
  );
}
