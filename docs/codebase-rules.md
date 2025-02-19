I'd love to put some hard & fast rules at the top of this document as well.
I've been burned by AI-first development in the past when these rules weren't properly defined.
Here are a few. Help me format them to make sure they will be heeded by an LLM.

# Codebase Best Practices for Deep Research Agent

This document defines our project's folder structure, file naming conventions, and documentation standards to ensure that our AI-first codebase is modular, scalable, and easy to maintain. It consolidates guidelines from our Tech Stack, UI, and Theme guides and aligns with our user flow, ensuring proper separation of concerns.

---

## 1. Folder Structure

Our monorepo structure is designed for clear separation of concerns, high navigability, and scalable development. Below is the expected organization:

```
root/
├── apps/                              // Deployable applications
│   ├── web/                          // Next.js frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/              // Reusable UI components (Shadcn themed)
│   │   │   │   └── [PageName]/      // Page-specific components
│   │   │   ├── app/                 // Next.js App Router pages
│   │   │   ├── hooks/               // Custom React hooks
│   │   │   ├── lib/                 // Utility functions
│   │   │   └── styles/              // Global styles
│   │   └── package.json             // Web app dependencies
│   └── api/                         // Backend API service
│       ├── src/
│       │   ├── routes/              // API routes
│       │   └── middleware/          // API middleware
│       └── package.json             // API dependencies
├── packages/                         // Shared internal packages
│   ├── deep-research/               // Core research engine
│   │   ├── src/
│   │   │   └── engine/             // Research engine implementation
│   │   └── package.json
│   ├── mcp/                        // MCP wrapper for orchestration
│   │   ├── src/
│   │   │   └── wrapper/            // MCP implementation
│   │   └── package.json
│   └── shared/                     // Shared utilities and types
│       ├── src/
│       │   ├── types/              // Shared TypeScript types
│       │   └── utils/              // Shared utility functions
│       └── package.json
├── services/                        // Local infrastructure
│   ├── firecrawl/                  // Self-hosted Firecrawl
│   └── searxng/                   // Self-hosted Searxng
├── docs/                           // Project documentation
│   ├── codebase-rules.md
│   ├── theme-guide.md
│   └── implementation.md
├── package.json                    // Root package.json for monorepo
└── pnpm-workspace.yaml            // PNPM workspace configuration
```

---

## 2. How This Structure Covers Our Intended Features

- **Deep Research Module:**  
  The `src/deep-research/` folder contains the core research functions responsible for executing deep, iterative searches and aggregating outputs as described in our project overview.

- **MCP Wrapper / Agent:**  
  The `src/mcp/` folder exposes the research functions as importable, asynchronous modules. This layer orchestrates calls from the web frontend and facilitates external integration without relying on CLI interfaces.

- **Web Frontend:**  
  - The `src/pages/` directory leverages Next.js dynamic routing and server-side rendering for the user interface, including API routes (`src/pages/api/`) for backend calls.
  - The `src/components/ui/` folder hosts reusable, Shadcn-themed UI components, while page-specific components are grouped by page name.

- **Supporting Modules:**  
  - `src/hooks/` and `src/state/` manage UI state and custom logic.
  - `src/jobs/` is designated for job queue handling (e.g., using BullMQ) to decouple long-running tasks.
  - `src/utils/` contains utility modules and helper functions to support the rest of the codebase.

- **Documentation & Organization:**  
  The `docs/` folder centralizes all project guidelines, and each file is equipped with header comments and JSDoc/TSDoc for maintainability and automated readability by AI tools (ensuring files remain under 250 lines where possible).

---

## 3. File Naming Conventions

- **React Components:**  
  Use **PascalCase** for component filenames (e.g., `Dashboard.tsx`, `InputField.tsx`).

- **Hooks and Utility Files:**  
  Use **camelCase** for functional files (e.g., `useQuery.ts`, `helpers.ts`).

- **API Routes:**  
  Place API routes under `pages/api/` using descriptive names (e.g., `research.ts`).

- **Documentation Files:**  
  Use **kebab-case** for markdown files (e.g., `codebase-best-practices.md`).

- **General Files:**  
  File names should be descriptive and avoid abbreviations unless widely understood.

---

## 4. Code and Documentation Standards

### File-Level Documentation
- **Header Comments:**  
  Every file must start with a header comment block that explains the file's purpose, content, and any important usage notes.
  
  Example for a TypeScript file:
  ```ts
  /**
   * Button.tsx
   * -----------
   * A reusable button component for the Deep Research Agent project.
   * Implements primary and secondary styling based on theme guidelines.
   */
  ```

### Function-Level Documentation
- **JSDoc/TSDoc Comments:**  
  All functions must include documentation for their purpose, parameters, and return values.
  
  Example:
  ```ts
  /**
   * Calculates the progress percentage for a research task.
   *
   * @param current - The current progress value.
   * @param total - The total value representing 100%.
   * @returns The progress percentage as a number.
   */
  function calculateProgress(current: number, total: number): number {
    return (current / total) * 100;
  }
  ```

### Code Structure
- **Modularity & Scalability:**  
  Ensure that code is organized into small, reusable modules. Group similar functionality together.
  
- **Functional and Declarative Programming:**  
  Use functional patterns (pure functions, hooks) and declarative JSX to maintain readability and predictability.

- **Line Count Limitation:**  
  Keep files under 250 lines whenever possible to ensure readability, especially by AI tools. Break larger files into smaller, more focused modules if needed.

---

## 5. Best Practices Summary

- **Centralize Documentation:**  
  Place all project guidelines in the `docs/` directory.
  
- **Consistent Naming and Structure:**  
  Follow the naming conventions and folder structure to maintain a navigable codebase.
  
- **Comprehensive Documentation:**  
  Each file and function should be thoroughly documented using header comments and JSDoc/TSDoc.
  
- **Code Readability and Maintenance:**  
  Adhere to code style conventions from ESLint and Prettier, and maintain a modular, scalable codebase as outlined in our Tech Stack, UI Guide, and Theme Guide.

---

By adhering to these best practices, our Deep Research Agent codebase will remain clear, maintainable, and scalable—enabling both developers and AI tools to navigate and understand the project efficiently.