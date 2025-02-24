-- Migration: Create Knowledge Graph Tables
-- Description: Creates tables for the knowledge graph system including domains,
-- areas, concepts, aspects, and information with proper relationships
-- and RLS policies.
--
-- Tables:
--   - domains: Top-level domains of knowledge
--   - areas: Major areas within domains
--   - concepts: Specific focus areas within areas
--   - aspects: Finer divisions under concepts
--   - information: Actual content with DoK levels
--   - tags: Reusable tags for cross-referencing
--   - content_tags: Junction table for content-tag relationships
--
-- Author: AI Assistant
-- Date: 2025-02-23

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

-- Create domains table
create table if not exists domains (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, name)
);

-- Create areas table
create table if not exists areas (
  id uuid primary key default uuid_generate_v4(),
  domain_id uuid references domains(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(domain_id, name)
);

-- Create concepts table
create table if not exists concepts (
  id uuid primary key default uuid_generate_v4(),
  area_id uuid references areas(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(area_id, name)
);

-- Create aspects table
create table if not exists aspects (
  id uuid primary key default uuid_generate_v4(),
  concept_id uuid references concepts(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  name text not null,
  description text,
  dok_score integer default 0,
  token_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(concept_id, name)
);

-- Create information table
create table if not exists information (
  id uuid primary key default uuid_generate_v4(),
  aspect_id uuid references aspects(id) on delete cascade not null,
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
  content_type text not null, -- 'domain', 'area', 'concept', 'aspect', or 'information'
  content_id uuid not null,
  created_at timestamp with time zone default now(),
  unique(tag_id, content_type, content_id)
);

-- Enable RLS on all tables
alter table domains enable row level security;
alter table areas enable row level security;
alter table concepts enable row level security;
alter table aspects enable row level security;
alter table information enable row level security;
alter table tags enable row level security;
alter table content_tags enable row level security;

-- Create indexes for better query performance
create index if not exists idx_domains_user_id on domains(user_id);
create index if not exists idx_areas_domain_id on areas(domain_id);
create index if not exists idx_concepts_area_id on concepts(area_id);
create index if not exists idx_aspects_concept_id on aspects(concept_id);
create index if not exists idx_information_aspect_id on information(aspect_id);
create index if not exists idx_content_tags_tag_id on content_tags(tag_id);
create index if not exists idx_content_tags_content on content_tags(content_type, content_id);

-- Create RLS policies for domains
create policy "users can view own domains"
  on domains for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own domains"
  on domains for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own domains"
  on domains for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own domains"
  on domains for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for areas
create policy "users can view own areas"
  on areas for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own areas"
  on areas for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own areas"
  on areas for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own areas"
  on areas for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for concepts
create policy "users can view own concepts"
  on concepts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own concepts"
  on concepts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own concepts"
  on concepts for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own concepts"
  on concepts for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create RLS policies for aspects
create policy "users can view own aspects"
  on aspects for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can create own aspects"
  on aspects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update own aspects"
  on aspects for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete own aspects"
  on aspects for delete
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
comment on table domains is 'Top-level domains of knowledge';
comment on table areas is 'Major areas within domains';
comment on table concepts is 'Specific focus areas within areas';
comment on table aspects is 'Finer divisions under concepts';
comment on table information is 'Actual content with DoK levels';
comment on table tags is 'Reusable tags for cross-referencing content';
comment on table content_tags is 'Junction table linking content to tags';

comment on column information.content is 'JSON object containing DoK-level bullet points';
comment on column information.embedding is 'Vector embedding for semantic search';
comment on column information.token_count is 'Number of tokens in the content';
comment on column aspects.token_count is 'Aggregated token count from all information entries'; 