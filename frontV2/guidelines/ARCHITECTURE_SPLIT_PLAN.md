# Architecture Split Plan (Step 3)

## Objective
Separate business logic from presentation so `frontV2` can change design without changing behavior.

## Target Structure

- `src/app/*`
  - app shell, router wiring, global layout only.
- `src/shared/*`
  - cross-cutting modules:
    - `config` (env/constants)
    - `api` (HTTP client + shared request behavior)
    - `routes` (path constants)
    - `ui` (reusable style primitives, later)
- `src/features/<feature>/*`
  - feature-scoped logic and UI:
    - `api/` endpoint wrappers
    - `model/` types/state/selectors
    - `hooks/` side-effect + orchestration
    - `ui/` presentational components
    - `pages/` route-level composition

## Rules

- Pages must not call `fetch` directly.
- Route components should compose feature hooks/components only.
- Shared HTTP behavior must be centralized in `src/shared/api/http.ts`.
- Route paths must come from `src/shared/routes/paths.ts`.
- Design tokens/styles can change freely; API contracts and behavior cannot.

## Migration Order

1. Move route constants and env/api client to `shared` (done).
2. Build feature modules for parity-critical flows first:
   - `recruit`, `contact`, `portfolio`, `admin-auth`.
3. Replace static/mock page data with feature hooks using shared API client.
4. Keep visual components in `ui/` and logic in `hooks/model`.
5. Add missing routes from freeze checklist and wire to feature pages.

## Definition of Done for Step 3

- Shared layers (`config`, `api`, `routes`) exist and are used by app router/navigation.
- No new page introduces direct endpoint strings inside presentational components.
- Next migration steps can proceed page-by-page without changing shared behavior contracts.

