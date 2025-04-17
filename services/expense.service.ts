import supabase from "../db/supabase.client"
import { CreateExpenseCommand } from "../types/types"

export async function createExpense(expense: CreateExpenseCommand & { user_id: string }) {
	const { data, error } = await supabase.from("expense").insert(expense).select().maybeSingle()
	return { data, error }
}

export async function getExpenses(page: number, limit: number) {
	const { data, error } = await supabase.from("expense").select("*").range((page - 1) * limit, page * limit)
	return { data, error }
}