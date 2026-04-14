"use client";

import { useEffect, useState } from "react";
import { Candidate } from "@/types/electoral";

interface VoteProgressBarProps {
  nieto: Candidate;
  aliaga: Candidate;
}

export function VoteProgressBar({ nieto, aliaga }: VoteProgressBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      className="mb-12 lg:mb-16 animate-fade-up"
      style={{ animationDelay: "0.2s" }}
      data-testid="vote-progress-bar"
    >
      <div className="flex justify-between items-end mb-3">
        <span className="font-label text-[10px] uppercase font-black text-primary">
          {nieto.name}
        </span>
        <span className="font-label text-[10px] uppercase font-black text-secondary">
          {aliaga.name}
        </span>
      </div>

      <div className="h-8 w-full bg-surface-container-highest rounded-sm flex overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-container to-primary transition-all duration-1000 ease-out"
          style={{ width: mounted ? `${nieto.percentage}%` : "0%" }}
          data-testid="nieto-bar"
        />
        <div className="h-full w-[2px] bg-surface-dim z-10 shrink-0" />
        <div
          className="h-full bg-secondary transition-all duration-1000 ease-out"
          style={{ width: mounted ? `${aliaga.percentage}%` : "0%" }}
          data-testid="aliaga-bar"
        />
      </div>

      <div className="flex justify-between mt-2 font-headline text-lg tabular-nums odometer">
        <span className="text-primary">{nieto.percentage}%</span>
        <span className="text-secondary">{aliaga.percentage}%</span>
      </div>
    </section>
  );
}
