"use client"

import { useQuery } from "@tanstack/react-query"
import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { getExpenses } from "@/services/expense.service"
import { ExpenseDTO } from "@/types/types"

interface ExpenseTableProps {
	onEdit: (expense: ExpenseDTO) => void
	onDelete: (expense: ExpenseDTO) => void
}

export function ExpenseTable({ onEdit, onDelete }: ExpenseTableProps) {
	const {
		data: expenses = [],
		isLoading,
		error,
	} = useQuery<ExpenseDTO[]>({
		queryKey: ["expenses"],
		queryFn: getExpenses,
	})

	if (error) {
		return (
			<div className="text-muted-foreground rounded-md border p-4 text-center text-sm">
				Error loading expenses. Please try again later.
			</div>
		)
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Date</TableHead>
						<TableHead className="text-right">Amount</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Source</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={7}>
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
								</div>
							</TableCell>
						</TableRow>
					) : expenses.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center">
								No expenses found.
							</TableCell>
						</TableRow>
					) : (
						expenses.map((expense) => (
							<TableRow key={expense.id}>
								<TableCell>{expense.title}</TableCell>
								<TableCell>{expense.description}</TableCell>
								<TableCell>{formatDate(expense.date)}</TableCell>
								<TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
								<TableCell>{expense.category_id}</TableCell>
								<TableCell>{expense.source_id}</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
											<Edit2 className="h-4 w-4" />
											<span className="sr-only">Edit</span>
										</Button>
										<Button variant="ghost" size="icon" onClick={() => onDelete(expense)}>
											<Trash2 className="h-4 w-4" />
											<span className="sr-only">Delete</span>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	)
}
