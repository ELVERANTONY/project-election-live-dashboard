export type CandidateId = "aliaga" | "sanchez";

export interface Candidate {
  id: CandidateId;
  rank: 2 | 3;
  name: string;
  party: string;
  votes: number;
  officialPct: number; // ONPE % of all valid votes
  sharePct: number;    // % among the 3 contenders, for the race bar
  imageUrl: string;
  imageAlt: string;
}

export interface KeikoData {
  votes: number;
  officialPct: number;
}

export interface DepartmentRow {
  ubigeo: string;
  name: string;
  aliagaPct: number;
  sanchezPct: number;
  aliagaVotes: number;
  sanchezVotes: number;
}

export interface DepartamentosData {
  departments: DepartmentRow[];
  lastSync: string;
}

export interface ElectoralData {
  keiko: KeikoData;
  contenders: [Candidate, Candidate]; // [aliaga, sanchez]
  gapToRunoff: number; // |Aliaga − Sánchez|
  secondPlace: CandidateId; // who currently holds the runoff spot
  aliagaLeadingSanchez: boolean; // Aliaga > Sánchez
  actasProcessed: number;
  lastSync: string;
  turnout: number;
  projectedRemaining: number;
  aliagaProbability: number;      // 0 to 100
  requiredRemainingShare: number; // % of remaining votes Aliaga needs (among Aliaga+Sanchez)
}
