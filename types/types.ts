/*
 * DTO and Command Model definitions for API operations.
 * These types are built on top of the Database types defined in db/database.types.ts.
 */

import type { Database } from "../db/database.types"

/**
 * Expense DTO and Command Models
 */
export type ExpenseDTO = Database["public"]["Tables"]["expense"]["Row"]

export type CreateExpenseCommand = Omit<
	Database["public"]["Tables"]["expense"]["Insert"],
	"id" | "created_at" | "updated_at"
>

export type UpdateExpenseCommand = { id: number } & Omit<Database["public"]["Tables"]["expense"]["Update"], "id">

/**
 * Category DTO and Command Models
 */
export type CategoryDTO = Database["public"]["Tables"]["category"]["Row"]

export type CreateCategoryCommand = Omit<
	Database["public"]["Tables"]["category"]["Insert"],
	"id" | "created_at" | "updated_at"
>

export type UpdateCategoryCommand = { id: number } & Omit<Database["public"]["Tables"]["category"]["Update"], "id">

/**
 * Source DTO and Command Models
 */
export type SourceDTO = Database["public"]["Tables"]["source"]["Row"]

export type CreateSourceCommand = Omit<
	Database["public"]["Tables"]["source"]["Insert"],
	"id" | "created_at" | "updated_at"
>

export type UpdateSourceCommand = { id: number } & Omit<Database["public"]["Tables"]["source"]["Update"], "id">

/**
 * Feedback DTO and Command Models
 */
export type FeedbackDTO = Database["public"]["Tables"]["feedback"]["Row"]

export type CreateFeedbackCommand = Omit<
	Database["public"]["Tables"]["feedback"]["Insert"],
	"id" | "created_at" | "updated_at"
>

export type UpdateFeedbackCommand = { id: number } & Omit<Database["public"]["Tables"]["feedback"]["Update"], "id">
