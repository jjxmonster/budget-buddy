"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createSource, deleteSource, updateSource } from "@/actions/source.actions"
import { CreateSourceCommand, UpdateSourceCommand } from "@/types/types"

export function useSourceMutations() {
	const queryClient = useQueryClient()

	const createMutation = useMutation({
		mutationFn: (data: CreateSourceCommand) => createSource(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sources"],
			})
			toast.success("Source has been added")
		},
		onError: (error: Error) => {
			toast.error(`Error adding source: ${error.message}`)
		},
	})

	const updateMutation = useMutation({
		mutationFn: (data: UpdateSourceCommand) => updateSource(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sources"],
			})
			toast.success("Source has been updated")
		},
		onError: (error: Error) => {
			toast.error(`Error updating source: ${error.message}`)
		},
	})

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteSource(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sources"],
			})
			toast.success("Source has been deleted")
		},
		onError: (error: Error) => {
			toast.error(`Error deleting source: ${error.message}`)
		},
	})

	return {
		createMutation,
		updateMutation,
		deleteMutation,
	}
}
