-- Migration: Create Knowledge Graph Tables
-- Description: Creates tables for the knowledge graph system including categories,
-- subcategories, topics, subtopics, and information with proper relationships
-- and RLS policies.
--
-- Tables:
--   - categories: Top-level domains of knowledge
--   - subcategories: Major areas within categories
--   - topics: Specific focus areas within subcategories
--   - subtopics: Finer divisions under topics
--   - information: Actual content with DoK levels
--   - tags: Reusable tags for cross-referencing
--   - content_tags: Junction table for content-tag relationships
--
-- Author: AI Assistant
-- Date: 2024-03-21

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Enable Vector extension
create extension if not exists "vector";

-- Create tags table first since it will be referenced by other tables
create table if not exists tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, name)
);

-- Create subcategories table
create table if not exists subcategories (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(category_id, name)
);

-- Create topics table
create table if not exists topics (
  id uuid primary key default uuid_generate_v4(),
  subcategory_id uuid references subcategories(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(subcategory_id, name)
);

-- Create subtopics table
create table if not exists subtopics (
  id uuid primary key default uuid_generate_v4(),
  topic_id uuid references topics(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  token_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(topic_id, name)
);

-- Create information table
create table if not exists information (
  id uuid primary key default uuid_generate_v4(),
  subtopic_id uuid references subtopics(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  content jsonb not null, -- Stores DoK-level bullet points
  embedding vector(1536), -- For semantic search
  token_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create content_tags junction table
create table if not exists content_tags (
  id uuid primary key default uuid_generate_v4(),
  tag_id uuid references tags(id) on delete cascade not null,
  content_type text not null, -- 'category', 'subcategory', 'topic', 'subtopic', or 'information'
  content_id uuid not null,
  created_at timestamp with time zone default now(),
  unique(tag_id, content_type, content_id)
);

-- Enable RLS on all tables
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table topics enable row level security;
alter table subtopics enable row level security;
alter table information enable row level security;
alter table tags enable row level security;
alter table content_tags enable row level security;

-- Create indexes for better query performance
create index if not exists idx_categories_user_id on categories(user_id);
create index if not exists idx_subcategories_category_id on subcategories(category_id);
create index if not exists idx_topics_subcategory_id on topics(subcategory_id);
create index if not exists idx_subtopics_topic_id on subtopics(topic_id);
create index if not exists idx_information_subtopic_id on information(subtopic_id);
create index if not exists idx_content_tags_tag_id on content_tags(tag_id);
create index if not exists idx_content_tags_content on content_tags(content_type, content_id);

-- Create RLS policies for categories
create policy "users can view own categories"
  on categories for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own categories"
  on categories for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own categories"
  on categories for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own categories"
  on categories for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for subcategories
create policy "users can view own subcategories"
  on subcategories for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own subcategories"
  on subcategories for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own subcategories"
  on subcategories for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own subcategories"
  on subcategories for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for topics
create policy "users can view own topics"
  on topics for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own topics"
  on topics for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own topics"
  on topics for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own topics"
  on topics for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for subtopics
create policy "users can view own subtopics"
  on subtopics for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own subtopics"
  on subtopics for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own subtopics"
  on subtopics for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own subtopics"
  on subtopics for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for information
create policy "users can view own information"
  on information for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own information"
  on information for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own information"
  on information for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own information"
  on information for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for tags (globally readable, but only creatable by authenticated users)
create policy "tags are publicly readable"
  on tags for select
  to authenticated
  using (true);

create policy "authenticated users can create tags"
  on tags for insert
  to authenticated
  with check (true);

-- Create RLS policies for content_tags
create policy "users can view content tags"
  on content_tags for select
  to authenticated
  using (true);

create policy "users can create content tags"
  on content_tags for insert
  to authenticated
  with check (true);

create policy "users can delete content tags"
  on content_tags for delete
  to authenticated
  using (true);

-- Add helpful comments
comment on table categories is 'Top-level domains of knowledge';
comment on table subcategories is 'Major areas within categories';
comment on table topics is 'Specific focus areas within subcategories';
comment on table subtopics is 'Finer divisions under topics';
comment on table information is 'Actual content with DoK levels';
comment on table tags is 'Reusable tags for cross-referencing content';
comment on table content_tags is 'Junction table linking content to tags';

comment on column information.content is 'JSON object containing DoK-level bullet points';
comment on column information.embedding is 'Vector embedding for semantic search';
comment on column information.token_count is 'Number of tokens in the content';
comment on column subtopics.token_count is 'Aggregated token count from all information entries'; 