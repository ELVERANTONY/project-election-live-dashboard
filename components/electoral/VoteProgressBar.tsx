"use client";

import { useEffect, useState } from "react";
import { Candidate, CandidateId } from "@/types/electoral";

interface VoteProgressBarProps {
  aliaga: Candidate;
  nieto: Candidate;
  sanchez: Candidate;
}

const COLOR_MAP: Record<CandidateId, string> = {
  aliaga:  "bg-gradient-to-r from-secondary-container to-secondary",
  nieto:   "bg-gradient-to-r from-primary-container to-primary",
  sanchez: "bg-gradient-to-r from-tertiary-container to-tertiary",
};

const TEXT_MAP: Record<CandidateId, string> = {
  aliaga:  "text-secondary",
  nieto:   "text-primary",
  sanchez: "text-tertiary",
};

export function VoteProgressBar({ aliaga, nieto, sanchez }: VoteProgressBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const segments = [aliaga, nieto, sanchez]
    .sort((a, b) => b.votes - a.votes)
    .map(c => ({ candidate: c, color: COLOR_MAP[c.id], textClass: TEXT_MAP[c.id] }));

  return (
    <section
      className="mb-12 animate-fade-up"
      style={{ animationDelay: "0.2s" }}
      data-testid="vote-progress-bar"
    >
      {/* Labels above */}
      <div className="flex mb-2">
        {segments.map(({ candidate, textClass }, i) => (
          <div
            key={candidate.id}
            className="font-label text-[10px] uppercase font-black truncate"
            style={{ width: `${candidate.sharePct}%`, textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}
          >
            <span className={textClass}>
              {candidate.name}
            </span>
          </div>
        ))}
      </div>

      {/* Bar */}
      <div className="h-8 w-full bg-surface-container-highest rounded-sm flex overflow-hidden">
        {segments.map(({ candidate, color }, i) => (
          <div
            key={candidate.id}
            className={`h-full transition-all duration-1000 ease-out ${color}`}
            style={{ width: mounted ? `${candidate.sharePct}%` : "0%" }}
            data-testid={`${candidate.id}-bar`}
          >
            {i < segments.length - 1 && (
              <div className="h-full w-[2px] bg-surface-dim ml-auto" />
            )}
          </div>
        ))}
      </div>

      {/* Percentages below */}
      <div className="flex mt-2">
        {segments.map(({ candidate, textClass }, i) => (
          <div
            key={candidate.id}
            className="font-headline text-base tabular-nums odometer"
            style={{ width: `${candidate.sharePct}%`, textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}
          >
            <span className={textClass}>
              {candidate.officialPct.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
