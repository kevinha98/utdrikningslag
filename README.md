# 🎉 Utdrikningslag — Interaktivt planleggingsdashboard

> 12-månedersplan for det perfekte utdrikningslaget. Oppgaver, budsjett, nedtelling og mer.

**[Se live-demo →](https://kevinha98.github.io/utdrikningslag/)**

---

## Funksjoner

- **12-månederstidslinje** — Interaktive kort med 3D-tilt-effekt og staggered animasjoner
- **Oppgavehåndtering** — Sjekkliste per måned med fremdriftsindikatorer og localStorage-persistens
- **Nedtellingsklokke** — Live flip-clock-animasjon ned til avreisedatoen
- **Budsjettsporing** — Legg til utgifter med kategorier, se forbruk per person og per kategori
- **Fremdriftsring** — Animert SVG-sirkelprogresjon som oppdateres i sanntid
- **Konfetti** — Festlige partikler når du fullfører en måned eller hele planen
- **Mørkt/lyst tema** — Bryter med animert sol/måne-ikon, persistert i localStorage
- **Responsivt design** — Optimalisert for mobil (375px), nettbrett (768px) og desktop (1440px)
- **UTF-8** — Full støtte for norske tegn (æ, ø, å) i all tekst

## Teknologistack

| Teknologi | Versjon | Bruk |
|-----------|---------|------|
| [React](https://react.dev/) | 19 | UI-rammeverk |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Typesikkerhet |
| [Vite](https://vite.dev/) | 8 | Bygg- og utviklingsverktøy |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Framer Motion](https://motion.dev/) | 12 | Animasjoner og overganger |
| [canvas-confetti](https://www.kirilv.com/canvas-confetti/) | 1.9 | Konfetti-effekter |
| [date-fns](https://date-fns.org/) | 4 | Datohåndtering |

## Kom i gang

### Forutsetninger

- [Node.js](https://nodejs.org/) 18+ (anbefalt: 22 LTS)
- npm 9+

### Installasjon

```bash
git clone https://github.com/kevinha98/utdrikningslag.git
cd utdrikningslag
npm install
```

### Lokal utvikling

```bash
npm run dev
```

Åpner på [http://localhost:5173/utdrikningslag/](http://localhost:5173/utdrikningslag/)

### Bygg for produksjon

```bash
npm run build
npm run preview
```

Output ligger i `dist/`-mappen.

## Konfigurasjon

### Endre avreisedato

Åpne [`src/data/months.ts`](src/data/months.ts) og endre `EVENT_DATE`:

```ts
export const EVENT_DATE = new Date('2027-04-10T14:00:00');
```

### Endre budsjett

I samme fil kan du justere standardverdier:

```ts
export const DEFAULT_BUDGET_PER_PERSON = 6000;
export const DEFAULT_NUM_PEOPLE = 8;
```

Disse kan også endres interaktivt i budsjettseksjonen av dashboardet.

## Deploy

Prosjektet deployes automatisk til GitHub Pages via GitHub Actions ved push til `main`-branchen.

Workflowen bygger med Vite og publiserer `dist/`-mappen til GitHub Pages.

**URL:** [https://kevinha98.github.io/utdrikningslag/](https://kevinha98.github.io/utdrikningslag/)

## Prosjektstruktur

```
src/
├── components/
│   ├── budget/          # Budsjettsporing, utgiftsrader, legg til utgift
│   ├── dashboard/       # Statistikkort, fremdriftsring, nedtelling
│   ├── effects/         # Konfetti, partikkelbakgrunn
│   ├── layout/          # Header, footer
│   ├── theme/           # Mørkt/lyst tema-bryter
│   └── timeline/        # Tidslinje, månedskort, oppgavepunkter
├── data/
│   └── months.ts        # 12-månedersplan med oppgaver
├── hooks/
│   ├── useBudget.ts     # Budsjetthåndtering med localStorage
│   ├── useLocalStorage.ts  # Generisk localStorage-hook
│   └── useTaskState.ts  # Oppgavestatus med localStorage
└── lib/
    ├── confetti.ts      # canvas-confetti wrapper
    └── types.ts         # TypeScript-typer og konstanter
```

## Lisens

MIT
