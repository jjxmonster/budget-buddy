-- Migration: Disable all policies
-- Description: Drops all RLS policies from Category, Source, and Expense tables
-- Author: Budget Buddy System
-- Date: 2024-03-21

-- Drop Category table policies
drop policy if exists "Users can view their own categories" on category;
drop policy if exists "Users can insert their own categories" on category;
drop policy if exists "Users can update their own categories" on category;
drop policy if exists "Users can delete their own categories" on category;

-- Drop Source table policies
drop policy if exists "Users can view their own sources" on source;
drop policy if exists "Users can insert their own sources" on source;
drop policy if exists "Users can update their own sources" on source;
drop policy if exists "Users can delete their own sources" on source;

-- Drop Expense table policies
drop policy if exists "Users can view their own expenses" on expense;
drop policy if exists "Users can insert their own expenses" on expense;
drop policy if exists "Users can update their own expenses" on expense;
drop policy if exists "Users can delete their own expenses" on expense; 