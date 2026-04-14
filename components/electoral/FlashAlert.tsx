interface FlashAlertProps {
  message: string;
  title?: string;
}

export function FlashAlert({ message, title = "Flash Alert" }: FlashAlertProps) {
  return (
    <div
      className="hidden lg:flex fixed bottom-8 right-8 z-[100] glass-panel p-6 rounded-sm border border-outline-variant/15 shadow-2xl items-center gap-4 max-w-sm animate-slide-in-right"
      style={{ animationDelay: "0.8s" }}
      data-testid="flash-alert"
    >
      <div className="relative shrink-0">
        <span className="material-symbols-outlined text-tertiary text-3xl">
          flash_on
        </span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-tertiary rounded-full animate-ping" />
      </div>
      <div>
        <h4 className="text-on-surface font-headline font-bold uppercase text-sm tracking-widest">
          {title}
        </h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
          {message}
        </p>
      </div>
    </div>
  );
}
