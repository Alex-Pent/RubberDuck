# RubberDuck

A friendly web app that helps non-technical small business owners find, compare and set up the right AI tools.
React + TypeScript + Tailwind, built with Vite. It works fully offline with mock data.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
```

## Plug in the real backend

All network calls live in **`src/api.ts`**. Nothing else in the app calls `fetch`.

1. Copy `.env.example` to `.env`.
2. Set:
   ```
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=https://your-backend.example.com
   ```
   Leave `VITE_API_BASE_URL` empty to call `/api/...` on the same origin. In dev, Vite proxies `/api` to `http://localhost:8000` (see `vite.config.ts`).
3. Restart `npm run dev`.

The backend should implement the contract below. Types are in `src/types.ts`.

| Method | Path | Returns |
|---|---|---|
| POST | `/api/search` | `{ searchId }` (body: `businessType, size, budget, category?, freeText?, existingTools[]`) |
| GET | `/api/search/:id/status` | `{ stage, percent, done }` (polled every 1.5s) |
| GET | `/api/search/:id/results` | `{ interpretedProblem, tools[] }` |
| GET | `/api/tools/:id/guide` | `{ whatItDoes[], setupSteps[], tips[], resources[] }` |
| GET *(optional)* | `/api/search/cached?businessType=&category=` | Same shape as results, or 404. Used as a fallback after a timeout or error. |

Notes:
- The loading screen times out after 90s, then offers Retry, the cached results (if the endpoint exists), or editing answers.
- Progress steps are driven by `percent` (0-24 = step 1, 25-49 = step 2, and so on). `stage` is announced to screen readers.
- Sorting by price or setup is done in the browser using `breakdown.price` and `breakdown.easeOfSetup`.
- `tools[].features` (string[]) is an optional extra used by the compare table.

## Structure

```
src/
  api.ts                 typed client + mock/real switch (USE_MOCK)
  types.ts               shared types and API shapes
  i18n.tsx               EN/ES keys + toggle (Spanish falls back to English)
  mock/data.ts           3 scenarios x 4 tools (HVAC calls, cafe inventory, landscaper quotes) + guides
  components/
    IntakeWizard.tsx     4-step form (fields in IntakeFields, ChipInput, MicButton)
    ProgressView.tsx     step list, skeletons, cancel, 90s timeout, retry
    ResultsList.tsx      answer chips, sort, compare bar, empty states
    ToolCard.tsx         rank, score, badges, sources, confidence
    ScoreBreakdown.tsx   expandable meters with text values
    CompareTable.tsx     real table on desktop, stacked cards on phones
    GuidePage.tsx        checklist (saved in localStorage), tips, tutorials, reminder
```

Mock mode picks a scenario from the business type and problem text. Try "HVAC" + "missed calls", "Restaurant or cafe" + "Inventory", or "Landscaping" + "quotes". Tool names and prices in the mock data are invented for the demo.

## Accessibility notes

Skip link, landmarks, visible focus rings, 44px minimum targets, labelled form controls, text alongside every color or bar, `prefers-reduced-motion` support, native `<dialog>` modals (focus trap and Esc), and a layout that reflows at 200% zoom. The microphone button uses the Web Speech API and shows a plain message when the browser lacks it.
