# Phase 3: Foundational Web Frontend - Query Submission & Parameter Config

We now focus on building the base UI elements described in our user-flow for initial query submission and basic parameter configuration.

---

## Checklist

1. **Page Structure & Routing**
   - [Frontend] Create a dedicated page (e.g., `/research`) for the query submission form.
   - [Frontend] Ensure that the global `Header` and `Footer` are in place (from the global layout).

2. **UI Components: Query Form**
   - [Frontend] Build a basic `ResearchForm.tsx` in `src/components/[PageName]/ResearchForm`:
     - An input field for the main query.
     - Additional fields/sliders for parameter configuration (e.g., breadth, depth).
     - A “Start Research” button.

3. **Form Submission & Validation**
   - [Frontend] On submit, validate user inputs (required fields, numeric ranges, etc.).
   - [Frontend] If valid, dispatch a request to the `/api/research` endpoint established in Phase 3.

4. **Parameter Persistance (Optional)**
   - [Frontend] Use Zustand or local component state to preserve query parameters across page navigations and potential refreshes.

5. **Basic Output Display**
   - [Frontend] Show a simple loading state after submission.
   - [Frontend] Display raw JSON results when the request completes (polish can come later).

6. **Integrate Linting & Pre-commit Hooks** (ongoing from Phase 1)
   - [Frontend] Ensure code quality rules are running seamlessly (ESLint, Prettier).

---

## Acceptance Criteria
- Users can input a query and select parameters on a dedicated page, see loading indicators, and eventually view the JSON result from the backend.
- The `Header` and `Footer` appear consistently across pages.
- Basic validations stop invalid queries or parameters from being processed.

## Outcome
Wrapping up Phase 3, a user can open a dedicated page (e.g., /research) to enter a query and set parameters (breadth, depth), submit, and see raw JSON or basic output—verifying frontend routing, form validation, and consistency in the UI (global Header/Footer).