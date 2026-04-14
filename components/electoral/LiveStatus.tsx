interface LiveStatusProps {
  lastSync: string;
  actasProcessed: number;
}

export function LiveStatus({ lastSync, actasProcessed }: LiveStatusProps) {
  return (
    <div
      className="flex items-center justify-between mb-8 animate-fade-up"
      data-testid="live-status"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full bg-tertiary animate-pulse"
          data-testid="live-dot"
        />
        <span className="font-label text-[10px] uppercase tracking-[0.2em] font-extrabold text-tertiary">
          En vivo
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-label text-[10px] uppercase tracking-widest font-bold">
          {actasProcessed}% Actas Procesadas
        </span>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold tabular-nums">
          Última sync: {lastSync}
        </span>
      </div>
    </div>
  );
}
