-- Migration: Create Category and Source tables
-- Description: Creates the initial Category and Source tables with RLS policies
-- Author: Budget Buddy System
-- Date: 2024-03-21

-- Create Category table
create table category (
    id serial primary key,
    user_id uuid references auth.users(id) not null,
    name varchar(40) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on Category table
alter table category enable row level security;

-- Create RLS policies for Category table
-- Policy for authenticated users to select their own categories
create policy "Users can view their own categories"
    on category for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for authenticated users to insert their own categories
create policy "Users can insert their own categories"
    on category for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for authenticated users to update their own categories
create policy "Users can update their own categories"
    on category for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for authenticated users to delete their own categories
create policy "Users can delete their own categories"
    on category for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create Source table
create table source (
    id serial primary key,
    user_id uuid references auth.users(id) not null,
    name varchar(40) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on Source table
alter table source enable row level security;

-- Create RLS policies for Source table
-- Policy for authenticated users to select their own sources
create policy "Users can view their own sources"
    on source for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for authenticated users to insert their own sources
create policy "Users can insert their own sources"
    on source for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for authenticated users to update their own sources
create policy "Users can update their own sources"
    on source for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for authenticated users to delete their own sources
create policy "Users can delete their own sources"
    on source for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create indexes for better query performance
create index category_user_id_idx on category(user_id);
create index source_user_id_idx on source(user_id); 