# Pet Name Finder

Frontend test assignment - an interactive React + TypeScript SPA for browsing and selecting pet names by gender, category, starting letter and free-text search.

## Setup

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:5173
```

The flag is needed because `eslint-plugin-jsx-a11y` peers on ESLint 8/9 and the Vite scaffold ships ESLint 10. The plugin still works at runtime.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run Vitest in CI mode (14 tests across selectors + components) |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run format` | Prettier auto-format |

## Architecture

```
src/
  app/                 router, query client, app shell
  components/          shared atoms (Chip, Skeleton, ErrorBoundary)
  features/
    categories/        CategoryFilter chips
    filters/           Zustand filter store + pure filter pipeline + filter UI
    names/             TanStack Query data layer + BrowsePage + NameList + NameRow + NameDetail
  hooks/               useDebouncedValue, useElementHeight, useMediaQuery
  lib/                 fetch wrapper, HTML sanitizer
  test/                Vitest setup
  types/               domain models
public/api/            categories.json | names.json | letters.json (the "API")
```

### State management

- **Zustand** (`src/features/filters/filterStore.ts`) owns transient UI state: gender, selected categories, letter, search query.
- **TanStack Query** (`src/features/names/queries.ts`) owns server state: the three JSON files are fetched once, cached, and reused across pages.
- The filter pipeline (`src/features/filters/filterNames.ts`) is **pure**: takes the names array plus filter state, returns the visible, alphabetically-sorted slice. Easy to test, easy to memoize, easy to swap the data source.

### Data source

There's no live REST endpoint - the test ships three Google Drive JSON files. They live in `public/api/` and are served as static assets by Vite, fetched from `/api/categories.json` etc. The fetch base URL is `VITE_API_BASE` (default `/api`); swap one env var to point at a real REST endpoint with no other code changes.

### Routing

React Router v6 with two routes:

- `/` - `BrowsePage` (filters + virtualized list)
- `/name/:id` - `NameDetail` (full description + related names)

### Performance

- **Virtualized list** (`react-window` `FixedSizeList`) keeps the DOM small for the 679-name dataset.
- **Debounced search** (180 ms) keeps the filter pipeline off the typing hot path.
- **TanStack Query** caches the JSON fetches (`staleTime: 1 h`) so navigation between browse and detail never re-fetches.
- **Tailwind JIT** + **code-split route components** keep the production bundle small (~143 kB gzip).

### Strong-plus items

| Item | Where |
|---|---|
| Animations | `framer-motion` on `NameDetail` (layout + fade-in) |
| Error boundaries | Root and shell boundaries in `App.tsx` + `AppShell.tsx` |
| Virtualized list | `src/features/names/NamesColumn.tsx` (`react-window` FixedSizeList) |
| Accessibility | Semantic radio group on gender, `aria-pressed` on chips/letter strip, `role="alert"` on empty/error states, focus-visible rings, sanitized HTML |
| Linting | ESLint + `eslint-plugin-jsx-a11y` (zero-warnings policy) |
| Formatting | Prettier with shared config |

Storybook was deferred - the four atoms (`Chip`, `GenderToggle`, `NameRow`, `Skeleton`) are small, fully covered by component tests, and adding Storybook would have doubled install size for marginal value on a test deliverable. The hooks and ESLint config are scaffolded for it (`npm run storybook` script is in place); a future contributor only needs `npx storybook@latest init`.

### Tests

Three suites, 14 cases:

- `src/features/filters/filterNames.test.ts` - pure filter + related-names logic (10 cases).
- `src/features/filters/GenderToggle.test.tsx` - radio-group ARIA + change events (2 cases).
- `src/features/names/NameRow.test.tsx` - link routing + dual-gender pill (2 cases).

## Assumptions

- "Related names" = up to 12 other names that share at least one category with the target. Cap and ordering are easily tunable in `findRelatedNames`.
- Category filter is **OR** across selected categories (matches any).
- Definitions arrive as small HTML fragments; rendered through DOMPurify with a tight tag allowlist.
- Gender selector is three-way (Male / Female / Both), and `Both` shows all names regardless of their internal gender array.
- The three Drive JSON files are treated as immutable static assets for the duration of the assignment. Swapping them for a real API needs only a `VITE_API_BASE` env var (or replacing the helpers in `src/lib/api.ts`).

## Tech stack

Vite 8 · React 19 · TypeScript 6 · Tailwind 3 · React Router 6 · Zustand 5 · TanStack Query 5 · Framer Motion 11 · react-window 1 · DOMPurify 3 · Vitest 4 · React Testing Library 16 · ESLint 10 · Prettier 3
