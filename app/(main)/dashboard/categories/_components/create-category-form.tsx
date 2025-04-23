"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { DEFAULT_USER_ID, useCategoryMutations } from "@/query-options/category/mutations"
import { CreateCategoryCommand } from "@/types/types"

interface CreateCategoryFormProps {
	onSuccess?: () => void
	onCancel?: () => void
}

const categorySchema = z.object({
	name: z.string().min(1, "Category name is required").max(40, "Category name cannot exceed 40 characters"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function CreateCategoryForm({ onSuccess, onCancel }: CreateCategoryFormProps) {
	const { createMutation } = useCategoryMutations()

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: "",
		},
	})

	const isSubmitting = form.formState.isSubmitting

	async function onSubmit(values: CategoryFormValues) {
		const command: CreateCategoryCommand = {
			...values,
			user_id: DEFAULT_USER_ID,
		}

		await createMutation.mutateAsync(command)
		form.reset()
		onSuccess?.()
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && onCancel?.()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Category</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter category name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Adding..." : "Add Category"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
