import { District } from "@/types/electoral";

interface DistrictTickerProps {
  districts: District[];
}

const winnerConfig = {
  nieto: {
    border: "border-primary",
    badge: "bg-primary text-primary-container",
    label: "NIETO LEAD",
  },
  aliaga: {
    border: "border-secondary",
    badge: "bg-secondary text-secondary-container",
    label: "ALIAGA LEAD",
  },
  tight: {
    border: "border-tertiary",
    badge: "bg-tertiary text-on-tertiary",
    label: "TIGHT",
  },
} as const;

function DistrictItem({ district, index }: { district: District; index: number }) {
  const config = winnerConfig[district.winner];

  return (
    <div
      className={`bg-surface-container-low p-4 border-l-4 animate-fade-up ${config.border}`}
      style={{ animationDelay: `${0.5 + index * 0.07}s` }}
      data-testid={`district-item-${district.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-label font-bold text-on-surface uppercase">
          {district.name}
        </span>
        <span className={`text-[10px] font-label px-2 py-0.5 rounded-full ${config.badge}`}>
          {config.label}
        </span>
      </div>
      <div className="flex justify-between items-end">
        <p className="text-2xl font-headline font-bold odometer tabular-nums">
          {district.percentage}%
        </p>
        <p className="text-xs font-body text-on-surface-variant">
          {district.processed}% Processed
        </p>
      </div>
    </div>
  );
}

export function DistrictTicker({ districts }: DistrictTickerProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-headline font-bold text-on-surface uppercase tracking-tight">
        District Ticker
      </h3>
      <div className="space-y-3 max-h-[480px] overflow-y-auto no-scrollbar pr-2">
        {districts.map((district, i) => (
          <DistrictItem key={district.name} district={district} index={i} />
        ))}
      </div>
    </div>
  );
}
