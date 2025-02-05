/*
  # SEO Analysis Database Schema

  1. New Tables
    - `seo_tasks`
      - Main task tracking table
      - Stores basic task info and overall status
    
    - `seo_summaries`
      - Stores /v3/on_page/summary data
      - One-to-one relationship with tasks
    
    - `seo_pages`
      - Stores /v3/on_page/pages data
      - One-to-many relationship with tasks
    
    - `seo_resources`
      - Stores /v3/on_page/resources data
      - One-to-many relationship with tasks
    
    - `seo_links`
      - Stores /v3/on_page/links data
      - One-to-many relationship with tasks
    
    - `seo_duplicate_tags`
      - Stores /v3/on_page/duplicate_tags data
      - One-to-many relationship with tasks
    
    - `seo_duplicate_content`
      - Stores /v3/on_page/duplicate_content data
      - One-to-many relationship with tasks
    
    - `seo_non_indexable`
      - Stores /v3/on_page/non_indexable data
      - One-to-many relationship with tasks
    
    - `seo_keyword_density`
      - Stores /v3/on_page/keyword_density data
      - One-to-many relationship with tasks

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
*/

-- Main task table
CREATE TABLE IF NOT EXISTS seo_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  task_id text NOT NULL UNIQUE,
  target_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Summary data
CREATE TABLE IF NOT EXISTS seo_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  crawl_progress text,
  crawl_status text,
  total_pages integer,
  pages_crawled integer,
  schema_types jsonb,
  internal_links_count integer,
  external_links_count integer,
  broken_links_count integer,
  broken_resources_count integer,
  duplicate_title_count integer,
  duplicate_description_count integer,
  duplicate_content_count integer,
  checks jsonb,
  page_metrics jsonb,
  created_at timestamptz DEFAULT now()
);

-- Pages data
CREATE TABLE IF NOT EXISTS seo_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  url text NOT NULL,
  status_code integer,
  size integer,
  load_time numeric,
  content_encoding text,
  media_type text,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- Resources data
CREATE TABLE IF NOT EXISTS seo_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  url text NOT NULL,
  resource_type text,
  size integer,
  encoded_size integer,
  total_transfer_size integer,
  fetch_time numeric,
  fetch_timing jsonb,
  created_at timestamptz DEFAULT now()
);

-- Links data
CREATE TABLE IF NOT EXISTS seo_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  url_from text NOT NULL,
  url_to text NOT NULL,
  link_type text,
  link_attributes jsonb,
  dofollow boolean,
  created_at timestamptz DEFAULT now()
);

-- Duplicate tags data
CREATE TABLE IF NOT EXISTS seo_duplicate_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  tag_type text NOT NULL,
  value text,
  count integer,
  urls jsonb,
  created_at timestamptz DEFAULT now()
);

-- Duplicate content data
CREATE TABLE IF NOT EXISTS seo_duplicate_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  url text NOT NULL,
  similarity_percent numeric,
  duplicate_urls jsonb,
  created_at timestamptz DEFAULT now()
);

-- Non-indexable pages data
CREATE TABLE IF NOT EXISTS seo_non_indexable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  url text NOT NULL,
  reason text,
  meta_robots jsonb,
  created_at timestamptz DEFAULT now()
);

-- Keyword density data
CREATE TABLE IF NOT EXISTS seo_keyword_density (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES seo_tasks(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  count integer,
  density numeric,
  urls jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE seo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_duplicate_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_duplicate_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_non_indexable ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_keyword_density ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own tasks"
  ON seo_tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for related tables to allow access through task ownership
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY[
      'seo_summaries',
      'seo_pages',
      'seo_resources',
      'seo_links',
      'seo_duplicate_tags',
      'seo_duplicate_content',
      'seo_non_indexable',
      'seo_keyword_density'
    ])
  LOOP
    EXECUTE format(
      'CREATE POLICY "Users can manage their own %I data"
        ON %I
        FOR ALL
        TO authenticated
        USING (EXISTS (
          SELECT 1 FROM seo_tasks
          WHERE id = %I.task_id
          AND user_id = auth.uid()
        ))',
      table_name,
      table_name,
      table_name
    );
  END LOOP;
END
$$;