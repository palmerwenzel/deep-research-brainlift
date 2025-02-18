# Migration Rules

This file defines the process and best practices for managing database migrations in TonIQ, focusing on Supabase’s Postgres environment.

---

## 1. Approach & Tooling

• Use the official Supabase CLI for generating and applying migrations.  
• Keep each migration atomic and feature-focused (e.g., “add-patients-table”).  
• Store all migration .sql files in a dedicated folder (e.g., `supabase/migrations`).

---

## 2. Migrations Structure

Typical order in a single migration file:
1. Types/Enums  
2. Tables  
3. Functions  
4. Triggers  
5. Policies (RLS)

Example snippet:
```sql
-- 2023xxxxxx_add_patients_table.sql

CREATE TYPE patient_status AS ENUM ('active', 'inactive');

CREATE TABLE patients (
  id uuid PRIMARY KEY,
  status patient_status NOT NULL DEFAULT 'active'
);

CREATE OR REPLACE FUNCTION ...
CREATE TRIGGER ...
CREATE POLICY ...
```

---

## 3. Local vs. Production

• Local Development  
  - `npx supabase db reset` to rebuild from scratch.  
  - Re-run migrations to ensure correctness.

• Production Deployment  
  - Use `npx supabase db push` to apply new migrations in order.  
  - Migrations must be forward-only; do not alter past migration files once deployed.

---

## 4. Testing & Validation

• Thoroughly test migrations in staging before rolling to production.  
• Verify RLS, triggers, and policies function as intended (no unauthorized access).  
• Document any manual steps (e.g., data seeding, backfilling) in the migration commit message.

---

## 5. Naming & Tracking

• Name each file with a timestamp + short description:  
  “20231005_create_cases.sql”  
• Provide a short comment block at the top explaining what’s changed and why.

---

## Conclusion

A well-structured migration workflow ensures consistent database evolution with minimal risk. Adhere to these rules for all TonIQ schema changes.