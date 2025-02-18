# Phase 4: MCP Wrapper & Basic API Endpoints

This phase introduces the **MCP (Modular, Composable, and Programmatic) wrapper**, exposing the deep research module’s capabilities through asynchronous calls. We’ll create basic Next.js API routes to handle requests from the frontend or external agents.

---

## Checklist

1. **MCP Wrapper Scaffold**
   - [Backend] In `src/mcp/mcpWrapper.ts`, build functions that:
     - Accept high-level parameters (query text, breadth, depth).
     - Invoke `performResearch` (Phase 2) with those parameters.
     - Structure or modify the returned data if necessary.

2. **Basic API Route**
   - [Backend] Create an endpoint in `src/pages/api/research.ts`:
     - Accepts user input (query, parameters).
     - Passes them to the MCP wrapper for processing.
     - Returns the final structured result (JSON, Markdown) to the client.

3. **Error Handling and Logging**
   - [Backend] Implement try/catch blocks and ensure any errors from the deep research module are caught and returned as readable HTTP error responses.
   - [Backend] Include basic logging for debugging (e.g., console logs or a more robust logger).

4. **Basic Endpoint Testing**
   - [Backend] Write integration tests hitting the `api/research` endpoint with mock queries.
   - [Backend] Confirm 200 responses for valid input, 400+ for invalid queries.

5. **Frontend Stub for Testing**
   - [Frontend] Create a simple test page (e.g., `/test-mcp`) that calls `/api/research` with a sample query to validate end-to-end flow.

---

## Acceptance Criteria
- `mcpWrapper.ts` is callable from the Next.js API route, returning correct research data.
- A simple test page can submit a query and display JSON results in the browser.
- Errors are properly handled and returned to the client in a standardized format.

## Outcome
Once Phase 4 is complete, you have an MCP wrapper that orchestrates calls to the deep research module, plus a basic `/api/research` route. A simple test page (e.g., `/test-mcp`) can send queries to this endpoint and show the responses with correct error handling.