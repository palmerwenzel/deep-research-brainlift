# Phase 7: Export & Knowledge Repository (“Second Brain”)

This phase covers the "post-research" actions where users can **export insights** in various formats and optionally **store** them in a personal knowledge repository (or "second brain"), aligning with both the PRD’s mention of knowledge organization and user-flow mentions of saving results.

---

## Checklist

1. **Export Functionality**
   - [Frontend] Provide buttons or menu options to export research results in PDF, Markdown, or JSON.
   - [Backend] Generate these formats server-side or client-side. Consider a library like `pdfkit` if generating PDFs on the server.

2. **Knowledge Repository UI**
   - [Frontend] Build a user-facing “My Knowledge” or “Second Brain” section (e.g., `/my-knowledge` page).
   - [Frontend] List previously saved research findings with sorting or filtering options.

3. **CRUD Operations Backend**
   - [Backend] Implement routes in `pages/api/knowledge.ts` to:
     - **Create** new entries (for saving results).
     - **Read** existing entries.
     - **Update** (optional, if we allow editing or re-labelling).
     - **Delete** entries a user no longer needs.

4. **Data Structure & Persistence**
   - [Backend] Decide on a data layer (could be file-based for MVP or a proper DB).
   - [Backend] Manage user context/auth if multiple users exist.

5. **User Feedback & Confirmation**
   - [Frontend] Enforce confirmations when deleting or overwriting old research artifacts.
   - [Frontend] Provide success notifications after saving or exporting.

---

## Acceptance Criteria
- Users can click a button to export the final research output in different formats (PDF, Markdown, JSON).
- A basic knowledge repository or “second brain” displays previously stored research sessions with the ability to retrieve or remove them.
- All export/save features function reliably under typical usage scenarios.

## Outcome
At the close of Phase 7, users can export their final research in multiple formats (PDF, Markdown, JSON) and access a basic “My Knowledge” or “Second Brain” section to view, retrieve, or delete saved sessions—completing an end-to-end research workflow.