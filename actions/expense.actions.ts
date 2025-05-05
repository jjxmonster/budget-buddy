"use server"

import { ExpenseFilter } from "@/app/(main)/dashboard/expenses/_components/filter-component"
import { createClient } from "@/db/supabase.client"
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
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	// Calculate range
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1

	// Start with a base query
	let dataQuery = supabase
		.from("expense")
		.select(
			`
			*,
			category:category_id(name, id),
			source:source_id(name, id)
		`
		)
		.eq("user_id", user.user?.id || "")

	let countQuery = supabase
		.from("expense")
		.select("*", { count: "exact" })
		.eq("user_id", user.user?.id || "")

	// Apply filters if provided
	if (filter) {
		// Search filter (search in title and description)
		if (filter.search) {
			const searchCondition = `title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`
			dataQuery = dataQuery.or(searchCondition)
			countQuery = countQuery.or(searchCondition)
		}

		// Date range filters
		if (filter.date_from) {
			const dateFrom = filter.date_from.toISOString().split("T")[0]
			dataQuery = dataQuery.gte("date", dateFrom)
			countQuery = countQuery.gte("date", dateFrom)
		}

		if (filter.date_to) {
			// Add one day to include the end date fully
			const nextDay = new Date(filter.date_to)
			nextDay.setDate(nextDay.getDate() + 1)
			const dateTo = nextDay.toISOString().split("T")[0]
			dataQuery = dataQuery.lt("date", dateTo)
			countQuery = countQuery.lt("date", dateTo)
		}

		// Amount range filters
		if (filter.amount_min !== undefined) {
			dataQuery = dataQuery.gte("amount", filter.amount_min)
			countQuery = countQuery.gte("amount", filter.amount_min)
		}

		if (filter.amount_max !== undefined) {
			dataQuery = dataQuery.lte("amount", filter.amount_max)
			countQuery = countQuery.lte("amount", filter.amount_max)
		}

		// Category and source filters
		if (filter.category_id) {
			dataQuery = dataQuery.eq("category_id", filter.category_id)
			countQuery = countQuery.eq("category_id", filter.category_id)
		}

		if (filter.source_id) {
			dataQuery = dataQuery.eq("source_id", filter.source_id)
			countQuery = countQuery.eq("source_id", filter.source_id)
		}
	}

	// Add pagination and sorting to data query
	dataQuery = dataQuery.range(from, to).order(filter?.sort_by || "date", { ascending: filter?.order === "asc" })

	// Execute both queries in parallel
	const [dataResult, countResult] = await Promise.all([dataQuery, countQuery])

	// Handle errors
	if (dataResult.error) {
		console.error(dataResult.error)
		throw new Error(`Failed to fetch expenses: ${dataResult.error.message}`)
	}

	if (countResult.error) {
		throw new Error(`Failed to count expenses: ${countResult.error.message}`)
	}

	// Transform data to ensure type safety
	const expenses = dataResult.data || []

	// Return the combined result with proper type assertion
	return {
		data: expenses,
		count: countResult.count || 0,
	}
}

export async function createExpense(command: CreateExpenseCommand): Promise<ExpenseDTO> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}
	const { data, error } = await supabase
		.from("expense")
		.insert({ ...command, user_id: user.user?.id })
		.select()
		.single()

	if (error) {
		throw new Error("Failed to create expense")
	}

	return data
}

export async function updateExpense(command: UpdateExpenseCommand): Promise<ExpenseDTO> {
	const supabase = await createClient()
	const { error: sessionError, data: user } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}
	const { data, error } = await supabase
		.from("expense")
		.update({ ...command, user_id: user.user?.id })
		.eq("id", command.id)
		.select()
		.single()

	if (error) {
		throw new Error("Failed to update expense")
	}

	return data
}

export async function deleteExpense(id: number): Promise<void> {
	const supabase = await createClient()
	const { error: sessionError } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}
	const { error } = await supabase.from("expense").delete().eq("id", id)

	if (error) {
		throw new Error("Failed to delete expense")
	}
}
