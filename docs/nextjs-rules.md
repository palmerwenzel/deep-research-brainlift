# Next.js Rules

This document outlines how to use Next.js App Router features effectively in TonIQ.

---

## 1. File-Based Routing

• Organize routes in the `app/` directory with descriptive folder names.  
• Use route groups for organization and protection:
  - `(auth)` for login/signup without affecting URL structure
  - `(protected)` for authenticated routes with role-based access
• Keep route-specific files together (page.tsx, actions.ts, loading.tsx, etc.).

Example structure:
```
app/
├── (auth)/
│   ├── login/
│   │   ├── page.tsx
│   │   ├── actions.ts
│   │   └── login-form.tsx
│   └── signup/
│       ├── page.tsx
│       ├── actions.ts
│       └── signup-form.tsx
├── (protected)/
│   ├── layout.tsx (auth checks)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── cases/
│   │   ├── page.tsx
│   │   └── new/
│   └── patients/
│       ├── page.tsx
│       └── [id]/
└── api/
    └── webhooks/
```

---

## 2. Server & Client Components

• Use server components whenever possible to reduce bundle size.  
• Move interactive UI logic or stateful hooks to `use client` components.  
• Do not combine server-only code with client code in the same component.

---

## 3. Data Fetching

• Fetch data in server components or server actions for improved performance.  
• Rely on official Next.js caching + revalidation strategies (e.g., revalidatePath).  
• Keep heavy logic on the server side.

---

## 4. API Routes (If Needed)

• For microservices or custom endpoints, group them under `app/api/`.  
• Keep them small and purpose-driven, returning JSON or relevant data structures.  
• For server-based auth flows, prefer server actions over a separate API route unless necessary.

---

## 5. Authentication & Authorization

• See auth-rules.md for complete details on server actions, Supabase integration, and role-based gating.  
• Use Next.js middleware or layout-based checks for route guarding.  
• (Optional) For a more SPA-like experience, you can perform minimal checks in middleware (verifying user session) and then rely on the client's AuthProvider to gate roles or other logic.

---

## 6. Deployment & Hosting

• Make sure your hosting platform (e.g., Vercel) supports Next.js 14 features.  
• Keep environment variables in a `.env` file, never exposing them to the browser.  
• Validate SSR configurations (.env) in local, staging, and production.

---

## 7. Summary

By leveraging server components, route groups, server actions, and optionally minimal server gating, TonIQ remains efficient and secure. Keep references to official Next.js docs (and our other internal rules) for consistent style and performance.