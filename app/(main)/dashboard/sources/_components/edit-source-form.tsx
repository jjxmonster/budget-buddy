"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSourceMutations } from "@/query-options/source/mutations"
import { SourceDTO, UpdateSourceCommand } from "@/types/types"

interface EditSourceFormProps {
	source: SourceDTO
	onSuccess?: () => void
	onCancel?: () => void
}

const sourceSchema = z.object({
	name: z.string().min(1, "Source name is required").max(40, "Source name cannot exceed 40 characters"),
})

type SourceFormValues = z.infer<typeof sourceSchema>

export function EditSourceForm({ source, onSuccess, onCancel }: EditSourceFormProps) {
	const { updateMutation } = useSourceMutations()

	const form = useForm<SourceFormValues>({
		resolver: zodResolver(sourceSchema),
		defaultValues: {
			name: source.name,
		},
	})

	// Update form when source changes
	useEffect(() => {
		form.reset({
			name: source.name,
		})
	}, [source, form])

	const isSubmitting = form.formState.isSubmitting

	async function onSubmit(values: SourceFormValues) {
		const command: UpdateSourceCommand = {
			id: source.id,
			name: values.name,
		}

		updateMutation.mutate(command)
		form.reset()
		onSuccess?.()
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && onCancel?.()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Source</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Source Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter source name" {...field} />
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
								{isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
