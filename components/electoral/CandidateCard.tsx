import Image from "next/image";
import { Candidate, CandidateId } from "@/types/electoral";

interface CandidateCardProps {
  candidate: Candidate;
  index?: number;
}

const idStyle: Record<CandidateId, { accent: string; border: string; bar: string }> = {
  aliaga:  { accent: "text-secondary", border: "border-secondary", bar: "bg-gradient-to-r from-secondary-container to-secondary" },
  sanchez: { accent: "text-tertiary",  border: "border-tertiary",  bar: "bg-gradient-to-r from-tertiary-container to-tertiary" },
};

const rankLabel: Record<2 | 3, string> = {
  2: "2do lugar",
  3: "3er lugar",
};

export function CandidateCard({ candidate, index = 0 }: CandidateCardProps) {
  const cfg = { ...idStyle[candidate.id], label: rankLabel[candidate.rank] };

  return (
    <div
      className={`bg-surface-container-low flex flex-col border-l-4 ${cfg.border} rounded-sm group hover:bg-surface-container-high transition-colors duration-300 animate-fade-up overflow-hidden`}
      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
      data-testid={`candidate-card-${candidate.id}`}
    >
      <div className="flex flex-1">
        {/* Image — fill container, object-cover crops white edges */}
        <div className="relative w-[120px] shrink-0 self-stretch overflow-hidden bg-surface-container-highest">
          <Image
            src={candidate.imageUrl}
            alt={candidate.imageAlt}
            fill
            className={`object-cover object-top transition-all duration-500 ${candidate.rank === 2 ? "" : "grayscale"}`}
            unoptimized
            sizes="150px"
          />
        </div>

        {/* Data */}
        <div className="flex flex-col justify-between p-5 flex-1 min-w-0">
          <div>
            <span className={`font-label text-[10px] uppercase tracking-widest font-bold ${cfg.accent}/70`}>
              {cfg.label}
            </span>
            <h2 className="font-headline text-xl font-bold text-on-surface uppercase tracking-tighter mt-0.5 leading-tight">
              {candidate.name}
            </h2>
            <span className="text-xs font-label text-on-surface-variant/50 mt-0.5 block truncate">
              {candidate.party}
            </span>
          </div>

          <div>
            <p className={`text-3xl font-headline font-black odometer leading-none ${cfg.accent}`}>
              {candidate.officialPct.toFixed(2)}%
            </p>
            <p className={`text-[11px] font-label uppercase tracking-widest ${cfg.accent}/70 mt-1`}>
              {candidate.votes.toLocaleString("es-PE")} votos
            </p>
          </div>
        </div>
      </div>

      {/* Percentage bar */}
      <div className="h-1.5 w-full bg-surface-container-highest shrink-0">
        <div
          className={`h-full transition-all duration-700 ${cfg.bar}`}
          style={{ width: `${candidate.officialPct}%` }}
        />
      </div>
    </div>
  );
}
