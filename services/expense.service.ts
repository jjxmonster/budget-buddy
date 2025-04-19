"use server"

import { PostgrestFilterBuilder } from "@supabase/supabase-js"
import { ExpenseFilter } from "@/app/(main)/dashboard/expenses/_components/filter-component"
import supabase from "@/db/supabase.client"
import { CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "@/types/types"

export interface PaginatedResult<T> {
	data: T[]
	count: number
}

export async function getExpenses(
	filter?: ExpenseFilter,
	page: number = 1,
	pageSize: number = 10
): Promise<PaginatedResult<ExpenseDTO>> {
	// Calculate range
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1

	// Build base query for both data and count
	const baseQuery = () => {
		let query = supabase.from("expense")

		// Apply filters if provided
		if (filter) {
			// Search filter (search in title and description)
			if (filter.search) {
				query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`)
			}

			// Date range filters
			if (filter.date_from) {
				query = query.gte("date", filter.date_from.toISOString().split("T")[0])
			}
			if (filter.date_to) {
				// Add one day to include the end date fully
				const nextDay = new Date(filter.date_to)
				nextDay.setDate(nextDay.getDate() + 1)
				query = query.lt("date", nextDay.toISOString().split("T")[0])
			}

			// Amount range filters
			if (filter.amount_min !== undefined) {
				query = query.gte("amount", filter.amount_min)
			}
			if (filter.amount_max !== undefined) {
				query = query.lte("amount", filter.amount_max)
			}

			// Category and source filters
			if (filter.category_id) {
				query = query.eq("category_id", filter.category_id)
			}
			if (filter.source_id) {
				query = query.eq("source_id", filter.source_id)
			}
		}

		return query
	}

	// Query for data with pagination
	const dataQuery = baseQuery()
		.select("*")
		.range(from, to)
		.order(filter?.sort_by || "date", { ascending: filter?.order === "asc" })

	// Query for count
	const countQuery = baseQuery().select("*", { count: "exact", head: true })

	// Execute both queries in parallel
	const [dataResult, countResult] = await Promise.all([dataQuery, countQuery])

	if (dataResult.error) {
		throw new Error(`Failed to fetch expenses: ${dataResult.error.message}`)
	}

	if (countResult.error) {
		throw new Error(`Failed to count expenses: ${countResult.error.message}`)
	}

	return {
		data: dataResult.data || [],
		count: countResult.count || 0,
	}
}

export async function createExpense(command: CreateExpenseCommand): Promise<ExpenseDTO> {
	const { data, error } = await supabase.from("expense").insert(command).select().single()

	if (error) {
		throw new Error("Failed to create expense")
	}

	return data
}

export async function updateExpense(command: UpdateExpenseCommand): Promise<ExpenseDTO> {
	const { data, error } = await supabase.from("expense").update(command).eq("id", command.id).select().single()

	if (error) {
		throw new Error("Failed to update expense")
	}

	return data
}

export async function deleteExpense(id: number): Promise<void> {
	const { error } = await supabase.from("expense").delete().eq("id", id)

	if (error) {
		throw new Error("Failed to delete expense")
	}
}
