export type CandidateId = "aliaga" | "nieto" | "sanchez";

export interface Candidate {
  id: CandidateId;
  rank: 2 | 3 | 4;
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
  nietoPct: number;
  sanchezPct: number;
  aliagaVotes: number;
  nietoVotes: number;
  sanchezVotes: number;
}

export interface DepartamentosData {
  departments: DepartmentRow[];
  lastSync: string;
}

export interface ElectoralData {
  keiko: KeikoData;
  contenders: [Candidate, Candidate, Candidate]; // [aliaga, nieto, sanchez]
  gap23: number;  // Aliaga − Nieto (how many Nieto needs)
  gap34: number;  // Nieto − Sánchez (Nieto's cushion)
  nietoLeading: boolean;
  actasProcessed: number;
  lastSync: string;
  turnout: number;
  projectedRemaining: number;
}
