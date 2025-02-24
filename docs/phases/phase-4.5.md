# Phase 4.5: Research History & Sidebar Navigation

This phase introduces persistent storage for research history and a ChatGPT-inspired sidebar UI, providing easy access to past research sessions and laying the groundwork for future phases.

---

## Checklist

1. **Database Schema & Storage**
   - [Backend] Create research history table and policies in Supabase:
     ```sql
     -- Create the research history table
     create table research_history (
       id uuid primary key default uuid_generate_v4(),
       user_id uuid references auth.users(id),
       query text not null,
       breadth smallint not null,
       depth smallint not null,
       learnings jsonb not null,
       visited_urls text[] not null,
       created_at timestamp with time zone default now(),
       updated_at timestamp with time zone default now()
     );

     -- Enable RLS
     alter table research_history enable row level security;

     -- Allow users to view their own research history
     create policy "Users can view their own research history."
       on research_history
       for select
       to authenticated
       using (auth.uid() = user_id);

     -- Allow users to create new research entries
     create policy "Users can create research entries."
       on research_history
       for insert
       to authenticated
       with check (auth.uid() = user_id);

     -- Allow users to delete their own research entries
     create policy "Users can delete their own research entries."
       on research_history
       for delete
       to authenticated
       using (auth.uid() = user_id);

     -- Create an index on user_id for better query performance
     create index idx_research_history_user_id
       on research_history
       using btree (user_id);
     ```

2. **Backend API Routes**
   - [Backend] Create `/api/research/history` endpoints:
     - GET: Fetch user's research history
     - POST: Save new research result
     - DELETE: Remove research entry

3. **Sidebar Component**
   - [Frontend] Create `ResearchSidebar` component:
     - Research history list
     - "New Research" button
     - History item actions (view/delete)
     - Empty state
     - Loading states

4. **Layout Updates**
   - [Frontend] Update main layout to include sidebar:
     - Responsive design (collapsible on mobile)
     - Consistent styling with main content
     - Proper navigation state management

5. **State Management**
   - [Frontend] Implement research history state:
     - Current research session
     - History list
     - Loading states
     - Error handling

6. **Research Result Storage**
   - [Frontend] Auto-save completed research
   - [Frontend] Handle failed saves gracefully
   - [Backend] Implement proper error handling

---

## Component Structure
```
components/
└── research/
    ├── ResearchSidebar/
    │   ├── index.tsx
    │   ├── HistoryList.tsx
    │   ├── HistoryItem.tsx
    │   └── NewResearchButton.tsx
    └── layout/
        └── ResearchLayout.tsx
```

## Acceptance Criteria
- Research results are automatically saved to the database
- Users can view their research history in the sidebar
- Users can delete individual research entries
- Sidebar is responsive and collapses on mobile
- All interactions have appropriate loading and error states
- Layout maintains consistency with existing design

## Outcome
By the end of Phase 4.5, users will have a persistent history of their research sessions accessible through a ChatGPT-style sidebar, providing a foundation for the advanced features planned in subsequent phases. 