import type { ElectoralData } from "@/types/electoral";

export const MOCK_ELECTORAL_DATA: ElectoralData = {
  keiko: {
    votes: 4_200_000,
    officialPct: 31.5,
  },
  contenders: [
    {
      id: "aliaga",
      rank: 2,
      name: "López Aliaga",
      party: "Partido Ejemplo B",
      votes: 2_600_000,
      officialPct: 19.5,
      sharePct: 68.42,
      imageUrl: "/api/candidato-img/00000002",
      imageAlt: "Rafael López Aliaga",
    },
    {
      id: "sanchez",
      rank: 3,
      name: "Sánchez",
      party: "Partido Ejemplo C",
      votes: 1_200_000,
      officialPct: 9.0,
      sharePct: 31.58,
      imageUrl: "/api/candidato-img/00000003",
      imageAlt: "Patricia Sánchez",
    },
  ],
  gapToRunoff: 1_400_000,
  secondPlace: "aliaga",
  aliagaLeadingSanchez: true,
  actasProcessed: 75.4,
  lastSync: "14:30:00 PET",
  turnout: 82.1,
  projectedRemaining: 12_500,
  aliagaProbability: 15,
  requiredRemainingShare: 51.2,
};
