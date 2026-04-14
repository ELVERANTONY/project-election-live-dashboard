import Image from "next/image";
import { Candidate } from "@/types/electoral";

interface CandidateCardProps {
  candidate: Candidate;
  index?: number;
}

const roleLabel: Record<Candidate["role"], string> = {
  leader: "Va primero",
  challenger: "Perseguidor",
};

export function CandidateCard({ candidate, index = 0 }: CandidateCardProps) {
  const isNieto = candidate.id === "nieto";
  const accent = isNieto ? "text-primary" : "text-secondary";
  const border = isNieto ? "border-primary" : "border-secondary";
  const bar = isNieto
    ? "bg-gradient-to-r from-primary-container to-primary"
    : "bg-secondary";

  return (
    <div
      className={`bg-surface-container-low flex flex-col border-l-4 ${border} rounded-sm group hover:bg-surface-container-high transition-colors duration-300 animate-fade-up overflow-hidden`}
      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
      data-testid={`candidate-card-${candidate.id}`}
    >
      {/* Body: image at native 150×150 + data */}
      <div className="flex flex-1">
        {/* Image — fill container, object-cover crops white edges */}
        <div className="relative w-[150px] shrink-0 self-stretch overflow-hidden bg-surface-container-highest">
          <Image
            src={candidate.imageUrl}
            alt={candidate.imageAlt}
            fill
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
            unoptimized
            sizes="150px"
          />
        </div>

        {/* Data */}
        <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
          <div>
            <span
              className={`font-label text-[10px] uppercase tracking-widest font-bold ${accent}/60`}
            >
              {roleLabel[candidate.role]}
            </span>
            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase tracking-tighter mt-0.5 truncate">
              {candidate.name}
            </h2>
            <span className="text-xs font-label text-on-surface-variant/50 mt-0.5 block truncate">
              {candidate.party}
            </span>
          </div>

          <div>
            <p className={`text-4xl font-headline font-black odometer leading-none ${accent}`}>
              {candidate.percentage}%
            </p>
            <p className={`text-[11px] font-label uppercase tracking-widest ${accent}/70 mt-1`}>
              {candidate.votes.toLocaleString("es-PE")} votos
            </p>
          </div>
        </div>
      </div>

      {/* Percentage bar */}
      <div className="h-1.5 w-full bg-surface-container-highest shrink-0">
        <div
          className={`h-full transition-all duration-700 ${bar}`}
          style={{ width: `${candidate.percentage}%` }}
        />
      </div>
    </div>
  );
}
