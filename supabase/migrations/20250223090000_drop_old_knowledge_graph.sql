-- Drop old knowledge graph tables in reverse order of dependencies

-- First drop junction tables
drop table if exists content_tags;

-- Drop content tables
drop table if exists information;

-- Drop hierarchy tables in reverse order
drop table if exists subtopics;
drop table if exists topics;
drop table if exists subcategories;
drop table if exists categories;

-- Drop shared tables
drop table if exists tags;

-- Note: We're not dropping the extensions since they'll be needed by the new schema
-- create extension if not exists "uuid-ossp";
-- create extension if not exists "vector"; 