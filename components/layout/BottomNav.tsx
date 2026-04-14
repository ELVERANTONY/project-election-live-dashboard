const tabs = [
  { icon: "sensors", label: "Live", active: true },
  { icon: "analytics", label: "Analysis", active: false },
  { icon: "notifications", label: "Alerts", active: false },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/15">
      {tabs.map((tab) => (
        <a
          key={tab.label}
          href="#"
          className={`flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95 ${
            tab.active ? "text-primary scale-110" : "text-on-surface/40 hover:text-primary"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={
              tab.active
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {tab.icon}
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest font-bold">
            {tab.label}
          </span>
        </a>
      ))}
    </nav>
  );
}
