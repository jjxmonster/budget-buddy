"use server"

import supabase from "@/db/supabase.client"
import { CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "@/types/types"

export async function getExpenses(): Promise<ExpenseDTO[]> {
	const { data, error } = await supabase.from("expense").select("*").order("date", { ascending: false })

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
