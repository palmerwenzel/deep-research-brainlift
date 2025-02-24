-- Migration: Create Conversation History Table
-- Description: Creates the conversation_history table to store user conversations
-- and sets up appropriate RLS policies for authenticated access.
--
-- Tables:
--   - conversation_history: Stores conversations, messages, and metadata
--
-- Policies:
--   - Authenticated users can view their own conversation history
--   - Authenticated users can create new conversation entries
--   - Authenticated users can delete their own conversation entries
--
-- Author: AI Assistant
-- Date: 2024-03-21

-- Create conversation history table
create table if not exists conversation_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  title text,
  messages jsonb not null,
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable row level security
alter table conversation_history enable row level security;

-- Create btree index on user_id for faster lookups
create index if not exists idx_conversation_history_user_id
  on conversation_history
  using btree (user_id);

-- Create policies for authenticated users
-- Note: We create separate policies for each operation as per best practices

-- Select policy: Users can view their own conversation history
create policy "authenticated users can view own conversation history"
  on conversation_history
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Insert policy: Users can create conversation entries
create policy "authenticated users can create conversation entries"
  on conversation_history
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Update policy: Users can update their own conversation entries
create policy "authenticated users can update conversation entries"
  on conversation_history
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Delete policy: Users can delete their own conversation entries
create policy "authenticated users can delete conversation entries"
  on conversation_history
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Comment on table and columns for better documentation
comment on table conversation_history is 'Stores user conversations with the AI';
comment on column conversation_history.user_id is 'References auth.users(id) - the owner of this conversation';
comment on column conversation_history.title is 'Optional title for the conversation';
comment on column conversation_history.messages is 'JSON array of messages in the conversation';
comment on column conversation_history.metadata is 'Optional metadata for the conversation'; 