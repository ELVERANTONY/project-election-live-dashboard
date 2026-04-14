const navItems = [
  { icon: "dashboard", label: "National Summary", active: true },
  { icon: "map", label: "Regional Heatmap", active: false },
  { icon: "receipt_long", label: "District Ticker", active: false },
  { icon: "history", label: "Historical Data", active: false },
];

export function SideNav() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-surface-container-low z-40 flex-col font-body font-medium shadow-2xl shadow-black/20">
      <div className="p-6">
        <h2 className="text-xl font-black text-on-surface">Electoral Authority</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={
              item.active
                ? "flex items-center gap-3 px-4 py-3 bg-surface-container-high text-primary border-r-4 border-primary transition-all duration-300"
                : "flex items-center gap-3 px-4 py-3 text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high transition-all duration-300"
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-surface-container rounded-lg p-4">
          <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
            Status
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="text-sm font-bold text-on-surface">LIVE FEED ACTIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
