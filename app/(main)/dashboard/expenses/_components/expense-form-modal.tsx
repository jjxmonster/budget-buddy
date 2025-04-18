"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ExpenseDTO } from "@/types/types"

const formSchema = z.object({
	title: z.string().min(1, "Title is required").max(50, "Title cannot exceed 50 characters"),
	description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
	date: z.date({
		required_error: "Date is required",
	}),
	amount: z.coerce.number().positive("Amount must be positive"),
	category_id: z.number().optional(),
	source_id: z.number().optional(),
})

export type ExpenseFormValues = z.infer<typeof formSchema>

interface ExpenseFormModalProps {
	open: boolean
	mode: "add" | "edit"
	defaultValues?: ExpenseDTO | null
	onClose: () => void
	onSubmit: (values: ExpenseFormValues) => void
}

export function ExpenseFormModal({ open, mode, defaultValues, onClose, onSubmit }: ExpenseFormModalProps) {
	const form = useForm<ExpenseFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues
			? {
					title: defaultValues.title,
					description: defaultValues.description || undefined,
					date: defaultValues.date ? new Date(defaultValues.date) : new Date(),
					amount: defaultValues.amount,
					category_id: defaultValues.category_id || undefined,
					source_id: defaultValues.source_id || undefined,
				}
			: {
					title: "",
					description: undefined,
					date: new Date(),
					amount: 0,
					category_id: undefined,
					source_id: undefined,
				},
	})

	const categories = [
		{ id: 1, name: "Food" },
		{ id: 2, name: "Transport" },
		{ id: 3, name: "Entertainment" },
	]

	const sources = [
		{ id: 1, name: "Cash" },
		{ id: 2, name: "Credit Card" },
		{ id: 3, name: "Bank Transfer" },
	]

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{mode === "add" ? "Add Expense" : "Edit Expense"}</DialogTitle>
					<DialogDescription>Fill in the details of your expense. Click save when you're done.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Expense title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Optional description" {...field} value={field.value || ""} />
									</FormControl>
									<FormDescription>Max 200 characters</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
												>
													{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input
											type="number"
											step="0.01"
											placeholder="0.00"
											{...field}
											onChange={(e) => {
												field.onChange(e.target.valueAsNumber)
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="category_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select
											onValueChange={(value) => field.onChange(Number(value))}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map((category) => (
													<SelectItem key={category.id} value={category.id.toString()}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="source_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Source</FormLabel>
										<Select
											onValueChange={(value) => field.onChange(Number(value))}
											defaultValue={field.value?.toString()}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select source" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{sources.map((source) => (
													<SelectItem key={source.id} value={source.id.toString()}>
														{source.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit">{mode === "add" ? "Add" : "Save"}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
