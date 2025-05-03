/*
 * DTO and Command Model definitions for API operations.
 * These types are built on top of the Database types defined in db/database.types.ts.
 */

import { Tables } from "@/db/database.types"
import type { Database } from "../db/database.types"

/**
 * Expense DTO and Command Models
 */
export type ExpenseDTO = Database["public"]["Tables"]["expense"]["Row"] & {
	category: CategoryDTO | null
	source: SourceDTO | null
}

export type CreateExpenseCommand = Omit<
	Database["public"]["Tables"]["expense"]["Insert"],
	"id" | "created_at" | "updated_at"
>

export type UpdateExpenseCommand = { id: number } & Omit<Database["public"]["Tables"]["expense"]["Update"], "id">

/**
 * Category DTO and Command Models
 */
export type CategoryDTO = Tables<"category">

export interface CreateCategoryCommand {
	name: string
	user_id: string
}

export interface UpdateCategoryCommand {
	id: number
	name: string
}

/**
 * Source DTO and Command Models
 */
export type SourceDTO = Tables<"source">

export interface CreateSourceCommand {
	name: string
	user_id: string
}

export interface UpdateSourceCommand {
	id: number
	name: string
}

/**
 * Feedback DTO and Command Models
 */
export type FeedbackDTO = Database["public"]["Tables"]["feedback"]["Row"]

export type CreateFeedbackCommand = Omit<
	Database["public"]["Tables"]["feedback"]["Insert"],
	"id" | "created_at" | "updated_at"
>

export type UpdateFeedbackCommand = { id: number } & Omit<Database["public"]["Tables"]["feedback"]["Update"], "id">
