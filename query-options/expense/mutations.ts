import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { getQueryClient } from "@/lib/get-query-client"
import { createExpense, deleteExpense, PaginatedResult, updateExpense } from "@/services/expense.service"
import { ExpenseDTO } from "@/types/types"

export const DEFAULT_USER_ID = "e34f411a-6c4c-46d8-844f-c6f2fcc8b6f6"

export const useCreateExpenseMutation = () => {
	const queryClient = getQueryClient()

	return useMutation({
		mutationFn: createExpense,
		onMutate: async (newExpense) => {
			await queryClient.cancelQueries({ queryKey: ["expenses"] })

			const previousData = queryClient.getQueryData<PaginatedResult<ExpenseDTO>>(["expenses"])

			if (previousData) {
				queryClient.setQueryData<PaginatedResult<ExpenseDTO>>(["expenses"], (old) => {
					if (!old) return { data: [], count: 0 }

					const optimisticExpense: ExpenseDTO = {
						id: Date.now(),
						title: newExpense.title,
						description: newExpense.description || null,
						amount: newExpense.amount,
						date: newExpense.date,
						category_id: newExpense.category_id || null,
						source_id: newExpense.source_id || null,
						user_id: DEFAULT_USER_ID,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					}

					return {
						data: [optimisticExpense, ...old.data],
						count: old.count + 1,
					}
				})
			}

			return { previousData }
		},
		onError: (_err, _newExpense, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(["expenses"], context.previousData)
			}
			toast.error("Failed to add expense. Please try again.")
		},
		onSuccess: () => {
			toast.success("Expense added successfully")
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["expenses"] })
		},
	})
}

export const useUpdateExpenseMutation = () => {
	const queryClient = getQueryClient()

	return useMutation({
		mutationFn: updateExpense,
		onMutate: async (updatedExpense) => {
			await queryClient.cancelQueries({ queryKey: ["expenses"] })

			const previousData = queryClient.getQueryData<PaginatedResult<ExpenseDTO>>(["expenses"])

			if (previousData) {
				queryClient.setQueryData<PaginatedResult<ExpenseDTO>>(["expenses"], (old) => {
					if (!old) return { data: [], count: 0 }

					return {
						data: old.data.map((expense) =>
							expense.id === updatedExpense.id ? { ...expense, ...updatedExpense } : expense
						),
						count: old.count,
					}
				})
			}

			return { previousData }
		},
		onError: (_err, _updatedExpense, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(["expenses"], context.previousData)
			}
			toast.error("Failed to update expense. Please try again.")
		},
		onSuccess: () => {
			toast.success("Expense updated successfully")
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["expenses"] })
		},
	})
}

export const useDeleteExpenseMutation = () => {
	const queryClient = getQueryClient()

	return useMutation({
		mutationFn: deleteExpense,
		onMutate: async (expenseId) => {
			await queryClient.cancelQueries({ queryKey: ["expenses"] })

			const previousData = queryClient.getQueryData<PaginatedResult<ExpenseDTO>>(["expenses"])

			if (previousData) {
				queryClient.setQueryData<PaginatedResult<ExpenseDTO>>(["expenses"], (old) => {
					if (!old) return { data: [], count: 0 }

					return {
						data: old.data.filter((expense) => expense.id !== expenseId),
						count: old.count - 1,
					}
				})
			}

			return { previousData }
		},
		onError: (_err, _expenseId, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(["expenses"], context.previousData)
			}
			toast.error("Failed to delete expense. Please try again.")
		},
		onSuccess: () => {
			toast.success("Expense deleted successfully")
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["expenses"] })
		},
	})
}
