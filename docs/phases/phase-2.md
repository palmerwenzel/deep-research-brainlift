# Phase 2: Deep Research Module

This phase centers on integrating or refactoring the open-source deep research engine (e.g., Firecrawl, Searxng, or similar) into our codebase as an importable, asynchronous module. It aligns with the "Deep Research Module" described in the PRD and project overview.

---

## Checklist

1. **Core Folder & File Setup**
   - [Backend] Create/Populate `src/deep-research/researchEngine.ts` with necessary functions (e.g., `performResearch`) that encapsulate the iterative/recursive search logic.
   - [Backend] Ensure these functions return structured results (JSON, Markdown, etc.) consistent with future front-end requirements.

2. **Local Integration (Self-Hosting)**
   - [Backend] Configure local services:
     - [x] Set up Firecrawl with Docker
     - [x] Configure environment variables and Redis
     - [x] Test basic Firecrawl functionality
     - [x] Implement Searxng as the search provider:
       - [x] Set up Searxng container
       - [x] Configure Searxng for multiple search engines
       - [x] Integrate with Firecrawl for enhanced search capabilities
     - [x] Verify complete search pipeline functionality

3. **Refactor for Asynchronous Imports**
   - [x] Encapsulate the existing CLI or original code in asynchronous functions to avoid spawning processes repeatedly.
   - [x] Use `async/await` patterns and error handling best practices.

4. **Testing & Validation**
   - [x] Write initial test verifying that `deepResearch` returns correct data for sample queries.
   - [x] Write comprehensive unit tests for core functionality:
     - [x] Query generation
     - [x] Result processing
     - [x] Error handling
     - [ ] Local service integration
   - [x] Mock local services for isolated testing

---

## Acceptance Criteria
- [x] `src/deep-research/researchEngine.ts` provides a stable API for performing iterative research.
- [x] Successful integration of both Firecrawl and Searxng in local environment.
- [x] Unit tests confirm that mock queries produce expected structured output (JSON, Markdown, or both).

## Outcome
At the end of Phase 2, the core deep research logic—with both Firecrawl and Searxng working in tandem—should be wrapped in an asynchronous function (e.g., performResearch) that can reliably return structured results, passing unit tests and ready for integration into the broader application.