"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Resolver, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCategoryMutations } from "@/query-options/category/mutations"
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

	const resolver: Resolver<CategoryFormValues> = zodResolver(categorySchema) as unknown as Resolver<CategoryFormValues>

	const form = useForm<CategoryFormValues, unknown, CategoryFormValues>({
		resolver,
		defaultValues: {
			name: "",
		},
	})

	const isSubmitting = form.formState.isSubmitting

	const onSubmit: SubmitHandler<CategoryFormValues> = async (values) => {
		const command: CreateCategoryCommand = {
			...values,
		}

		createMutation.mutate(command)
		form.reset()
		onSuccess?.()
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && onCancel?.()}>
			<DialogContent className="sm:max-w-[425px]" data-testid="create-category-dialog">
				<DialogHeader>
					<DialogTitle>Add Category</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2" data-testid="create-category-form">
						<FormField<CategoryFormValues>
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter category name" {...field} data-testid="category-name-input" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={isSubmitting}
								data-testid="cancel-category-button"
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting} data-testid="submit-category-button">
								{isSubmitting ? "Adding..." : "Add Category"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
