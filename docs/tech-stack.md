# Tech Stack Rules, Best Practices, and Conventions for Deep Research Agent

This document outlines best practices, limitations, and conventions for using the selected technologies in the Deep Research Agent project. It serves as a comprehensive guide to ensure consistency, maintainability, scalability, and robust performance across the stack.

---

## 1. Programming Language & Runtime: TypeScript on Node.js

### Best Practices
- **Strict Type Safety:**  
  - Enable `strict: true` in your `tsconfig.json` to enforce strict type-checking.
  - Leverage TypeScript's built-in utility types and use type inference where possible.
- **Modular Code Structure:**  
  - Organize code into modules and separate concerns logically.
  - Prefer using functions over classes for clear, predictable behavior.
- **Error Handling:**  
  - Use `try/catch` blocks with promises and async/await.
  - Provide detailed error messages and consider creating custom error types.
- **Dependency Management:**  
  - Use modern package managers (npm or yarn) with lock files.
  - Regularly update dependencies while ensuring compatibility with the codebase.

### Common Pitfalls & Limitations
- **Overcomplex Generics:**  
  - Avoid overly complex type definitions that may reduce readability.
- **Inadequate Typings for External Libraries:**  
  - Ensure that third-party libraries have proper TypeScript typings or install @types packages.
- **Performance Overhead:**  
  - Avoid heavy synchronous operations; leverage Node's asynchronous APIs to maintain non-blocking behavior.

---

## 2. Frontend Framework: React with Next.js

### Best Practices
- **File-Based Routing:**  
  - Utilize Next.js' file-based routing system effectively; keep routes clear and hierarchical.
- **Data Fetching:**  
  - Use Next.js data fetching methods (getStaticProps, getServerSideProps) as appropriate to balance SSR and SSG.
- **Component Structure:**  
  - Build functional components using hooks, following a declarative programming pattern.
  - Organize components into logical folders (atoms, molecules, organisms) to promote reusability.
- **Performance Optimization:**  
  - Utilize lazy loading and code-splitting for components not required on initial render.
  - Optimize images and static assets via Next.js' built-in Image Optimization.

### Common Pitfalls & Limitations
- **Server/Client Mismatch:**  
  - Be cautious with code that runs on both server and browser; distinguish between SSR and client-only logic.
- **Hydration Issues:**  
  - Ensure state consistency between server-rendered HTML and client-side hydration to avoid warnings/errors.
- **Excessive Re-Renders:**  
  - Use React.memo or useCallback where appropriate to prevent unnecessary re-renders.

---

## 3. UI Components & Styling: Tailwind CSS + Shadcn (Radix UI)

### Best Practices
- **Utility-First Styling:**  
  - Use Tailwind CSS utility classes to quickly compose layouts, spacing, and responsive designs.
  - Customize the Tailwind configuration for design tokens (colors, spacing, fonts) to align with the theme.
- **Accessible Components:**  
  - Rely on Shadcn components built on Radix UI to ensure accessible and customizable UI elements.
  - Override default styles using Tailwind classes without directly modifying component internals.
- **Consistent Design Patterns:**  
  - Follow the design tokens outlined in the theme guide.
  - Use clear naming conventions for custom classes or variants to promote consistency.

### Common Pitfalls & Limitations
- **Overriding Styles:**  
  - Avoid heavy customization that negates the benefits of the pre-built accessibility of Shadcn/Radix UI.
- **Performance Considerations:**  
  - Be mindful of runtime performance when applying many utility classes; use PurgeCSS (or Tailwind's built-in JIT mode) to remove unused styles.
- **Responsive Complexity:**  
  - Thoroughly test responsive behaviors across devices to ensure consistency.

---

## 4. Backend Framework / API Layer: Next.js API Routes

### Best Practices
- **Endpoint Organization:**  
  - Organize API routes as modular and reusable functions.
  - Maintain clear separation between business logic and handler functions.
- **Security:**  
  - Implement robust authentication and authorization checks on API routes.
  - Use middleware to handle common tasks (e.g., logging, error handling, and rate limiting).
- **Performance:**  
  - Optimize endpoints by caching responses where applicable.
  - Leverage asynchronous processing and avoid blocking operations in API routes.

### Common Pitfalls & Limitations
- **Cold Start Delays:**  
  - Understand that serverless functions may experience cold starts; optimize your endpoints for performance.
- **Error Propagation:**  
  - Ensure errors are caught and handled gracefully, providing meaningful responses to the client.

---

## 5. Database / Backend-as-a-Service: Supabase

### Best Practices
- **Security & Environment Variables:**  
  - Store API keys and secrets securely using environment variables.
  - Leverage Supabase's built-in authentication and authorization mechanisms.
- **Real-Time Subscriptions:**  
  - Use Supabase's real-time subscriptions to keep your UI in sync with the database.
- **Query Optimization:**  
  - Optimize queries and use indexes where necessary to improve query performance.
  - Write clear and concise queries to reduce load on the database.

### Common Pitfalls & Limitations
- **Data Consistency:**  
  - Ensure consistency when handling real-time updates.
- **Complex Joins:**  
  - Overly complex queries may require additional indexing or optimization.

---

## 6. Vector Database Integration: Supavec (VectorDB wrapped for Supabase)

### Best Practices
- **Semantic Search Optimization:**  
  - Use vector embeddings with care, ensuring that your indexing strategy supports efficient semantic search.
- **Integration Consistency:**  
  - Maintain consistency between your primary database (Supabase) and the vector database.
- **Monitoring & Maintenance:**  
  - Regularly monitor performance and adjust dimensions or similarity thresholds based on feedback.

### Common Pitfalls & Limitations
- **Query Complexity:**  
  - Vector searches can be computationally expensive; optimize query frequency and payload size.
- **Scalability:**  
  - Evaluate the limits of the vector database wrapping for large-scale semantic search needs.

---

## 7. Deployment & Hosting: Vercel

### Best Practices
- **Environment Management:**  
  - Use Vercel's environment configuration to securely store credentials and deployment settings.
- **Optimized Builds:**  
  - Leverage Vercel's optimized Next.js support for rapid deployments and performance.
- **Monitoring:**  
  - Set up logging and monitoring to track performance, errors, and usage metrics.

### Common Pitfalls & Limitations
- **Cold Starts:**  
  - Understand that serverless functions may experience cold starts; optimize for performance where possible.

---

## 8. Orchestration & Job Queue: BullMQ

### Best Practices
- **Queue Management:**  
  - Use BullMQ for heavy, asynchronous jobs; isolate long-running tasks from user-facing operations.
- **Error Handling:**  
  - Implement robust error handling and retries within the job queue.
  - Monitor queue health and job failures for proactive maintenance.
- **Concurrency Control:**  
  - Use proper rate limiting and concurrency controls to avoid overwhelming external APIs or services.

### Common Pitfalls & Limitations
- **Memory Leaks:**  
  - Ensure that queues do not hold on to completed or failed jobs longer than necessary.
- **Distributed Processing:**  
  - When scaling, ensure that multiple BullMQ workers coordinate effectively without locking issues.

---

## 9. State Management: Zustand

### Best Practices
- **Selective Subscription:**  
  - Use Zustand's selective subscriptions to only re-render components that need updates.
- **Modularity:**  
  - Organize the global state into small, focused slices to improve performance and manageability.
- **Cleanup:**  
  - Properly remove or reset state slices when components unmount to avoid memory leaks.

### Common Pitfalls & Limitations
- **Overuse of Global State:**  
  - Avoid storing excessively granular data in global state; prefer local component states when appropriate.
- **Debugging:**  
  - Use middleware (like Redux DevTools) if needed to help debug state changes in larger applications.

---

## 10. Testing & Quality Assurance: ESLint, Prettier, Vitest

### Best Practices
- **Linting & Formatting:**  
  - Enforce code quality using ESLint and auto-formatting via Prettier. Integrate these tools into your CI pipeline.
- **Unit & Integration Testing:**  
  - Write comprehensive tests using Vitest, leveraging its native TypeScript support and ESM compatibility.
  - Take advantage of Vitest's built-in watch mode and fast test execution.
  - Note: Some existing services (like Firecrawl) may continue using Jest until migration is complete.
- **Continuous Integration:**  
  - Run tests on every commit to ensure that changes do not break existing functionality.
- **Mocking:**  
  - Use Vitest's mocking capabilities for API routes, asynchronous functions, and state management to isolate tests.
  - Leverage Vitest's compatibility with Jest's mocking syntax for easier migration from existing Jest tests.

### Common Pitfalls & Limitations
- **Test Coverage Gaps:**  
  - Ensure that tests cover both frontend and backend components to avoid overlooked edge cases.
  - Use Vitest's coverage reporting to identify areas needing additional test coverage.
- **Flaky Tests:**  
  - Design tests to be deterministic, especially when working with asynchronous processes or real-time updates.
  - Take advantage of Vitest's improved handling of async operations and timeouts.

---

## Summary

By following these best practices and conventions, the Deep Research Agent team will ensure that our application is scalable, maintainable, and robust. Regularly revisit this guide as the project evolves and new best practices emerge to maintain high standards in performance, security, and code quality.

---