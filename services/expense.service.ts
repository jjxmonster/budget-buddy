"use server"

import { ExpenseFilter } from "@/app/(main)/dashboard/expenses/_components/filter-component"
import supabase from "@/db/supabase.client"
import { CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "@/types/types"

export async function getExpenses(filter?: ExpenseFilter): Promise<ExpenseDTO[]> {
	let query = supabase.from("expense").select("*")

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

		// Sorting
		if (filter.sort_by) {
			query = query.order(filter.sort_by, { ascending: filter.order === "asc" })
		} else {
			query = query.order("date", { ascending: false })
		}
	} else {
		// Default sorting
		query = query.order("date", { ascending: false })
	}

	const { data, error } = await query

	if (error) {
		throw new Error("Failed to fetch expenses")
	}

	return data
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
