interface LiveStatusProps {
  lastSync: string;
  actasProcessed: number;
  isFinal: boolean;
}

export function LiveStatus({ lastSync, actasProcessed, isFinal }: LiveStatusProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2 animate-fade-up border-b border-outline-variant/10 pb-4"
      data-testid="live-status"
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <div
              className={`absolute h-full w-full rounded-full opacity-40 ${isFinal ? "bg-emerald-400" : "bg-primary animate-ping"}`}
            />
            <div
              className={`relative h-2 w-2 rounded-full ${isFinal ? "bg-emerald-400" : "bg-primary"}`}
              data-testid="live-dot"
            />
          </div>
          <span
            className={`font-headline text-xs uppercase tracking-[0.3em] font-black ${isFinal ? "text-emerald-400" : "text-primary"}`}
          >
            {isFinal ? "Escrutinio Final" : "Transmisión en Vivo"}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <h1 className="font-headline text-4xl lg:text-5xl font-black text-on-surface tracking-tighter uppercase leading-none">
            Elecciones 2026
          </h1>
          <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold">
            Fuente oficial: ONPE
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-1.5">
        <div className="flex items-baseline gap-2">
          <span className="font-headline text-4xl lg:text-5xl font-black text-primary odometer">
            {actasProcessed.toFixed(3)}
          </span>
          <span className="font-headline text-xl font-bold text-on-surface-variant/70 uppercase">
            %
          </span>
        </div>
        <div className="flex flex-col sm:items-end">
          <span className="font-label text-[11px] uppercase tracking-widest text-on-surface font-black">
            Actas Procesadas
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-bold tabular-nums mt-0.5">
            Última actualización: {lastSync}
          </span>
        </div>
      </div>
    </div>
  );
}
