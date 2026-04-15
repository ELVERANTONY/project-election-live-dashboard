# ¿Nieto pasa a Aliaga?

Electoral live-tracker for Peru's 2026 Primera Vuelta. Tracks the three-way race for the second runoff spot behind Keiko Fujimori — polling ONPE every 30 seconds.

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- Tailwind CSS v4
- Playwright (e2e tests)

## Dev

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm lint
pnpm test       # Playwright e2e (auto-starts dev server if needed)
pnpm test:ui    # Playwright interactive UI
```

Run a single test file:

```bash
pnpm playwright test tests/animations.spec.ts
```

## Architecture

Single-page app — no auth, no backend persistence, no database.

**Data flow:**

```
useElectoralData (polls every 30s)
  └─ /api/electoral  (proxies ONPE, normalizes response)
       └─ resultadoelectoral.onpe.gob.pe

/api/candidato-img/[dni]  (proxies candidate photos, avoids CORS)
```

**Key files:**

| File | Purpose |
|---|---|
| `types/electoral.ts` | Single source of truth for `ElectoralData`, `Candidate`, `KeikoData` |
| `lib/electoral.ts` | Fetches + normalizes ONPE data, computes derived fields |
| `lib/useElectoralData.ts` | Client hook — polls `/api/electoral` every 30 s |
| `components/electoral/ElectoralDashboard.tsx` | Root display component |
| `app/api/electoral/route.ts` | ONPE proxy + response normalization |
| `app/opengraph-image.tsx` | Dynamic OG image (server-rendered) |

**Candidate codes** (ONPE `codigoAgrupacionPolitica`): Keiko=`"8"`, Aliaga=`"35"`, Nieto=`"16"`, Sánchez=`"10"`.

## Derived data

`lib/electoral.ts` computes these fields on every fetch:

| Field | Meaning |
|---|---|
| `secondPlace` | Which of the three contenders currently holds the runoff spot |
| `gapToRunoff` | Absolute vote gap between Nieto and whoever is in 2nd place |
| `gap23` | Raw Aliaga − Nieto gap |
| `gap34` | Raw Nieto − Sánchez gap |
| `nietoLeading` | `true` when Nieto > Aliaga |
| `sanchezLeading` | `true` when Sánchez > Nieto |

Candidate `rank` (2/3/4) is computed dynamically by sorting the three contenders by votes — it is not hardcoded.

## Styling

Tailwind v4 (`@import "tailwindcss"` in `globals.css`). All design tokens are CSS custom properties in `@theme {}`. Never hardcode hex values — use Tailwind utilities (`bg-primary`, `text-on-surface-variant`) or `var(--color-*)`.

Candidate colors are identity-based (not rank-based):

| Candidate | Color token |
|---|---|
| Aliaga | `secondary` |
| Nieto | `primary` |
| Sánchez | `tertiary` |

Custom utilities: `.glass-panel`, `.odometer`, `.animate-fade-up`, `.animate-slide-in-right`, `.no-scrollbar`.

Three font families: `font-headline` (Space Grotesk), `font-body` (Work Sans), `font-label` (Inter).
