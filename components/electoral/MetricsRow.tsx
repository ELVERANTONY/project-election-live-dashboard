interface MetricsRowProps {
  turnout: number;
  projectedRemaining: number;
}

interface MetricItem {
  label: string;
  value: string;
}

export function MetricsRow({ turnout, projectedRemaining }: MetricsRowProps) {
  const metrics: MetricItem[] = [
    {
      label: "Participación ciudadana",
      value: `${turnout.toFixed(2)}%`,
    },
    {
      label: "Actas por procesar",
      value: `~${projectedRemaining.toLocaleString("es-PE")}`,
    },
  ];

  return (
    <div className="mt-12 mb-8 space-y-4">
      {metrics.map((metric, i) => (
        <div
          key={metric.label}
          className={`flex justify-between items-center py-3 ${
            i < metrics.length - 1 ? "border-b border-outline-variant/10" : ""
          }`}
        >
          <span className="font-label text-[10px] uppercase font-bold text-on-surface-variant">
            {metric.label}
          </span>
          <span className="font-headline text-sm tabular-nums text-on-surface">
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
}
