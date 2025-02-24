-- Migration: Create Research History Table
-- Description: Creates the research_history table to store user research sessions
-- and sets up appropriate RLS policies for authenticated access.
--
-- Tables:
--   - research_history: Stores research queries, results, and metadata
--
-- Policies:
--   - Authenticated users can view their own research history
--   - Authenticated users can create new research entries
--   - Authenticated users can delete their own research entries
--
-- Author: AI Assistant
-- Date: 2024-03-20

-- Create research history table
create table if not exists research_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  query text not null,
  breadth smallint not null,
  depth smallint not null,
  learnings jsonb not null,
  visited_urls text[] not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable row level security
alter table research_history enable row level security;

-- Create btree index on user_id for faster lookups
create index if not exists idx_research_history_user_id
  on research_history
  using btree (user_id);

-- Create policies for authenticated users
-- Note: We create separate policies for each operation as per best practices

-- Select policy: Users can view their own research history
create policy "authenticated users can view own research history"
  on research_history
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Insert policy: Users can create research entries
create policy "authenticated users can create research entries"
  on research_history
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Delete policy: Users can delete their own research entries
create policy "authenticated users can delete research entries"
  on research_history
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Comment on table and columns for better documentation
comment on table research_history is 'Stores user research sessions and their results';
comment on column research_history.user_id is 'References auth.users(id) - the owner of this research entry';
comment on column research_history.query is 'The original research query input by the user';
comment on column research_history.breadth is 'Research breadth parameter (1-5)';
comment on column research_history.depth is 'Research depth parameter (1-3)';
comment on column research_history.learnings is 'JSON array of learnings from the research';
comment on column research_history.visited_urls is 'Array of URLs visited during research'; 