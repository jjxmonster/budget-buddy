"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSourceMutations } from "@/query-options/source/mutations"
import { CreateSourceCommand } from "@/types/types"

interface CreateSourceFormProps {
	onSuccess?: () => void
	onCancel?: () => void
}

const sourceSchema = z.object({
	name: z.string().min(1, "Source name is required").max(40, "Source name cannot exceed 40 characters"),
})

type SourceFormValues = z.infer<typeof sourceSchema>

export function CreateSourceForm({ onSuccess, onCancel }: CreateSourceFormProps) {
	const { createMutation } = useSourceMutations()

	const form = useForm<SourceFormValues>({
		resolver: zodResolver(sourceSchema),
		defaultValues: {
			name: "",
		},
	})

	const isSubmitting = form.formState.isSubmitting

	async function onSubmit(values: SourceFormValues) {
		const command: CreateSourceCommand = {
			...values,
		}

		createMutation.mutate(command)
		form.reset()
		onSuccess?.()
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && onCancel?.()} data-testid="create-source-dialog">
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle data-testid="create-source-dialog-title">Add Source</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2" data-testid="create-source-form">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Source Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter source name" {...field} data-testid="source-name-input" />
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
								data-testid="cancel-source-button"
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting} data-testid="submit-source-button">
								{isSubmitting ? "Adding..." : "Add Source"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
