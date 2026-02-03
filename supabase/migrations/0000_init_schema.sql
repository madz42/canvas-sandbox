-- Create enums
create type channel_type as enum ('facebook', 'instagram', 'linkedin', 'display');
create type status_type as enum ('draft', 'active', 'archived');

-- Create templates table
create table templates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  channel channel_type not null,
  status status_type default 'draft',
  canvas_data jsonb
);

-- Create designs table
create table designs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  template_id uuid references templates(id) on delete set null,
  name text not null,
  canvas_data jsonb
);
