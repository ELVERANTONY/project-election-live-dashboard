export function TopBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface flex justify-between items-center px-6 h-16 border-b border-outline-variant/20">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black text-secondary select-none">R</span>
        <h1 className="text-xl font-bold tracking-tight text-on-surface font-headline">
          ¿Aliaga pasa a Sánchez?
        </h1>
      </div>

      <span className="text-xs text-on-surface/50 font-label uppercase tracking-widest hidden sm:block">
        Primera Vuelta 2026 · En vivo
      </span>
    </header>
  );
}
