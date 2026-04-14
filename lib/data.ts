import { ElectoralData } from "@/types/electoral";

export const electoralData: ElectoralData = {
  candidates: [
    {
      id: "nieto",
      name: "Nieto",
      party: "Fuerza Ciudadana",
      votes: 1338620,
      percentage: 48.2,
      role: "challenger",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAoOGN4yzzerRd44fk6gjhqz9I13RjeleWnukc1FP1Y0MgKCpJyN5Ttcad3-jHlVvzNU614QvxbPuGb4TjojpK8Kb38bZbQzvN9iy6WHWlSNzHi30_RhrMzJexLwPhTmv7wiGy93YxQ2EexzuOd9Rj8W6zT6f7tBMtXUgRAuTNaC2X7Lu8PUOekkc2MY11jt_Aa0-5j8YVQd3JyZk7whUqTRwBtVXj1JTLkIqATDfjSevfaSA31U15_bDfXJh6WLtgnYeoFHPcLmlI",
      imageAlt: "Candidate Nieto",
    },
    {
      id: "aliaga",
      name: "López Aliaga",
      party: "Renovación Nacional",
      votes: 1342901,
      percentage: 51.8,
      role: "leader",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCHFJObIXEu0HyaF798JLbWX_XsBegcKEQPhhmKTGvyzGsvsuMqOwgiYWkY7ryqwMbrnVlN3HbbdTsdhFpICmXMFtSoCw82TyfGEMXEuDYekZmjBkiGZBBh-mGB4pK15dFLm5uNrD7p9L06F0dvpEZi1YjkTTWRO9H1q6siy6iAasqqdKS9ZVWn-AMaINFHkt8qPt3Cj3SJRx7qDBXkTTUtuvhw0Avg3qJjAEJqfwk2ZWa4bGgYaYjg2Ki0wmQ0NjPgMjxbPj1Z_8M",
      imageAlt: "Candidate López Aliaga",
    },
  ],
  gap: 4281,
  actasProcessed: 94.8,
  lastSync: "14:32:01 PET",
  turnout: 76.32,
  projectedRemaining: 124000,
  districts: [
    { name: "San Isidro", percentage: 62.1, processed: 98, winner: "nieto" },
    { name: "Miraflores", percentage: 51.4, processed: 85, winner: "aliaga" },
    { name: "Surco", percentage: 49.8, processed: 72, winner: "tight" },
    { name: "San Borja", percentage: 55.2, processed: 91, winner: "nieto" },
    { name: "Carabayllo", percentage: 53.7, processed: 64, winner: "nieto" },
    { name: "La Molina", percentage: 50.1, processed: 79, winner: "tight" },
  ],
};
