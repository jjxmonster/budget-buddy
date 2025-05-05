"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createExpense, deleteExpense, updateExpense } from "@/actions/expense.actions"
import { CreateExpenseCommand, UpdateExpenseCommand } from "@/types/types"

export function useExpenseMutations() {
	const queryClient = useQueryClient()

	const createMutation = useMutation({
		mutationFn: (data: CreateExpenseCommand) => createExpense(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["expenses"],
			})
			toast.success("Expense added successfully")
		},
		onError: (error: Error) => {
			toast.error(`Failed to add expense: ${error.message}`)
		},
	})

	const updateMutation = useMutation({
		mutationFn: (data: UpdateExpenseCommand) => updateExpense(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["expenses"],
			})
			toast.success("Expense updated successfully")
		},
		onError: (error: Error) => {
			toast.error(`Failed to update expense: ${error.message}`)
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteExpense(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["expenses"],
			})
			toast.success("Expense deleted successfully")
		},
		onError: (error: Error) => {
			toast.error(`Failed to delete expense: ${error.message}`)
		},
	})

	return {
		createMutation,
		updateMutation,
		deleteMutation,
	}
}
