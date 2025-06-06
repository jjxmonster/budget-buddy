"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createCategory, deleteCategory, updateCategory } from "@/actions/category.actions"
import { CreateCategoryCommand, UpdateCategoryCommand } from "@/types/types"

export function useCategoryMutations() {
	const queryClient = useQueryClient()

	const createMutation = useMutation({
		mutationFn: (data: CreateCategoryCommand) => createCategory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			toast.success("Category has been added")
		},
		onError: (error: Error) => {
			toast.error(`Error adding category: ${error.message}`)
		},
	})

	const updateMutation = useMutation({
		mutationFn: (data: UpdateCategoryCommand) => updateCategory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			toast.success("Category has been updated")
		},
		onError: (error: Error) => {
			toast.error(`Error updating category: ${error.message}`)
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["categories"],
			})
			toast.success("Category has been deleted")
		},
		onError: (error: Error) => {
			toast.error(`Error deleting category: ${error.message}`)
		},
	})

	return {
		createMutation,
		updateMutation,
		deleteMutation,
	}
}
