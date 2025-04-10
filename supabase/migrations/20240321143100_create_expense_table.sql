-- Migration: Create Expense table
-- Description: Creates the Expense table with foreign key relationships to Category and Source tables
-- Author: Budget Buddy System
-- Date: 2024-03-21

-- Create Expense table
create table expense (
    id serial primary key,
    user_id uuid references auth.users(id) not null,
    title varchar(50) not null,
    description varchar(200),
    date date not null,
    amount numeric(10,2) not null,
    category_id integer references category(id) on delete set null,
    source_id integer references source(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on Expense table
alter table expense enable row level security;

-- Create RLS policies for Expense table
-- Policy for authenticated users to select their own expenses
create policy "Users can view their own expenses"
    on expense for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for authenticated users to insert their own expenses
create policy "Users can insert their own expenses"
    on expense for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for authenticated users to update their own expenses
create policy "Users can update their own expenses"
    on expense for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for authenticated users to delete their own expenses
create policy "Users can delete their own expenses"
    on expense for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create indexes for better query performance
create index expense_user_id_idx on expense(user_id);
create index expense_date_idx on expense(date);
create index expense_category_id_idx on expense(category_id);
create index expense_source_id_idx on expense(source_id);
create index expense_amount_idx on expense(amount); 