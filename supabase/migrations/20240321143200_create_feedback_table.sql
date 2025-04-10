-- Migration: Create Feedback table
-- Description: Creates the Feedback table for storing AI assistant interactions
-- Author: Budget Buddy System
-- Date: 2024-03-21

-- Create Feedback table
create table feedback (
    id serial primary key,
    question text not null,
    answer text not null,
    rating integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on Feedback table
alter table feedback enable row level security;

-- Create RLS policies for Feedback table
-- Since this is a public table, we'll allow anyone to view feedback
create policy "Anyone can view feedback"
    on feedback for select
    to anon, authenticated
    using (true);

-- Only authenticated users can insert feedback
create policy "Authenticated users can insert feedback"
    on feedback for insert
    to authenticated
    with check (true);

-- No one can update or delete feedback to maintain integrity
-- (intentionally not creating update/delete policies) 