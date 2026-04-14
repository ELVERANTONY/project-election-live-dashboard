export type CandidateId = "nieto" | "aliaga";
export type WinnerStatus = "nieto" | "aliaga" | "tight";

export interface Candidate {
  id: CandidateId;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  role: "challenger" | "leader";
  imageUrl: string;
  imageAlt: string;
}

export interface District {
  name: string;
  percentage: number;
  processed: number;
  winner: WinnerStatus;
}

export interface ElectoralData {
  candidates: [Candidate, Candidate]; // [nieto, aliaga]
  gap: number;
  actasProcessed: number;
  lastSync: string;
  turnout: number;
  projectedRemaining: number;
  districts: District[];
}
