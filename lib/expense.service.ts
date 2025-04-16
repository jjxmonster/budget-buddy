import supabase from "../db/supabase.client"
import { CreateExpenseCommand } from "../types/types"

export async function createExpense(expense: CreateExpenseCommand & { user_id: string }) {
	const { data, error } = await supabase.from("expense").insert(expense).select().maybeSingle()
	return { data, error }
}
