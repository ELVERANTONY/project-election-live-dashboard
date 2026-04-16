"use client";

import { useState } from "react";
import { useDepartamentosData } from "@/lib/useDepartamentosData";
import { DepartmentRow } from "@/types/electoral";

type Candidate = "aliaga" | "sanchez";
type Direction = "desc" | "asc";

const CANDIDATE_CONFIG = {
  aliaga:  { label: "López Aliaga", color: "text-secondary",  border: "border-secondary",  bg: "bg-secondary/10"  },
  sanchez: { label: "Sánchez",      color: "text-tertiary",   border: "border-tertiary",   bg: "bg-tertiary/10"   },
} as const;

function pct(row: DepartmentRow, c: Candidate) {
  return c === "aliaga" ? row.aliagaPct : row.sanchezPct;
}

function Bar({ value, max, candidate }: { value: number; max: number; candidate: Candidate }) {
  const w = max > 0 ? (value / max) * 100 : 0;
  const colors = { aliaga: "bg-secondary", sanchez: "bg-tertiary" };
  return (
    <div className="h-1.5 w-full bg-surface-container-highest rounded-sm overflow-hidden">
      <div
        className={`h-full ${colors[candidate]} rounded-sm transition-all duration-500`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

export function DepartamentosTable() {
  const { data, loading, error } = useDepartamentosData();
  const [sortBy, setSortBy] = useState<Candidate>("aliaga");
  const [direction, setDirection] = useState<Direction>("desc");

  if (loading) {
    return (
      <div className="glass-panel p-6 flex items-center justify-center text-on-surface/50 font-label text-sm">
        Cargando datos por departamento...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-panel p-6 text-tertiary font-label text-sm">
        Error cargando departamentos.
      </div>
    );
  }

  const sorted = [...data.departments].sort((a, b) => {
    const diff = pct(b, sortBy) - pct(a, sortBy);
    return direction === "desc" ? diff : -diff;
  });

  const maxPct = Math.max(...data.departments.map((r) => pct(r, sortBy)));

  return (
    <section className="glass-panel p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-headline text-base font-bold uppercase tracking-wider text-on-surface">
            Resultados por departamento
          </h2>
          <p className="text-xs text-on-surface/50 font-label mt-0.5">
            Actualizado {data.lastSync}
          </p>
        </div>

        {/* Candidate toggle */}
        <div className="flex gap-2 flex-wrap">
          {(["aliaga", "sanchez"] as Candidate[]).map((c) => {
            const cfg = CANDIDATE_CONFIG[c];
            const active = sortBy === c;
            return (
              <button
                key={c}
                onClick={() => setSortBy(c)}
                className={`px-3 py-1.5 text-xs font-label uppercase tracking-wider border rounded-sm transition-colors cursor-pointer ${
                  active
                    ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                    : "border-outline-variant/30 text-on-surface/50 hover:border-outline-variant/60"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort direction */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDirection("desc")}
          className={`px-3 py-1 text-xs font-label border rounded-sm transition-colors cursor-pointer ${
            direction === "desc"
              ? "border-on-surface/30 text-on-surface bg-surface-container"
              : "border-outline-variant/20 text-on-surface/40 hover:border-outline-variant/40"
          }`}
        >
          Más votado ↓
        </button>
        <button
          onClick={() => setDirection("asc")}
          className={`px-3 py-1 text-xs font-label border rounded-sm transition-colors cursor-pointer ${
            direction === "asc"
              ? "border-on-surface/30 text-on-surface bg-surface-container"
              : "border-outline-variant/20 text-on-surface/40 hover:border-outline-variant/40"
          }`}
        >
          Menos votado ↑
        </button>
      </div>

      {/* Table */}
      <div className="space-y-1.5">
        {sorted.map((row, i) => {
          const activePct = pct(row, sortBy);
          const cfg = CANDIDATE_CONFIG[sortBy];
          return (
            <div
              key={row.ubigeo}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm bg-surface-container-low hover:bg-surface-container transition-colors"
            >
              {/* Rank */}
              <span className="text-xs font-label text-on-surface/30 w-5 shrink-0 text-right">
                {i + 1}
              </span>

              {/* Dept name */}
              <span className="font-label text-sm text-on-surface w-32 shrink-0 truncate">
                {row.name}
              </span>

              {/* Bar + pct */}
              <div className="flex-1 min-w-0">
                <Bar value={activePct} max={maxPct} candidate={sortBy} />
              </div>

              {/* Active candidate % */}
              <span className={`text-sm font-bold font-label w-12 text-right shrink-0 ${cfg.color}`}>
                {activePct.toFixed(2)}%
              </span>

              {/* Other two candidates (compact) */}
              <div className="hidden sm:flex gap-3 shrink-0">
                {(["aliaga", "sanchez"] as Candidate[])
                  .filter((c) => c !== sortBy)
                  .map((c) => (
                    <span
                      key={c}
                      className={`text-xs font-label w-10 text-right ${CANDIDATE_CONFIG[c].color} opacity-60`}
                    >
                      {pct(row, c).toFixed(1)}%
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend for other columns */}
      <div className="hidden sm:flex justify-end gap-3 mt-3 pt-3 border-t border-outline-variant/20">
        {(["aliaga", "sanchez"] as Candidate[])
          .filter((c) => c !== sortBy)
          .map((c) => (
            <span key={c} className={`text-xs font-label ${CANDIDATE_CONFIG[c].color} opacity-60`}>
              {CANDIDATE_CONFIG[c].label}
            </span>
          ))}
      </div>
    </section>
  );
}
