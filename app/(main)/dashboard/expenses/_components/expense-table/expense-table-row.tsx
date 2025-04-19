"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { ExpenseDTO } from "@/types/types"
import { ExpenseTableActions } from "./expense-table-actions"

export function formatApiValue(value: string | number | null) {
	if (value === null) return "-"
	return value
}

interface ExpenseTableRowProps {
	expense: ExpenseDTO
	onEdit: (expense: ExpenseDTO) => void
	onDelete: (expense: ExpenseDTO) => void
}

export function ExpenseTableRow({ expense, onEdit, onDelete }: ExpenseTableRowProps) {
	return (
		<TableRow>
			<TableCell>{expense.title}</TableCell>
			<TableCell>{expense.description || "-"}</TableCell>
			<TableCell>{formatDate(expense.date)}</TableCell>
			<TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
			<TableCell>{formatApiValue(expense.category_id)}</TableCell>
			<TableCell>{formatApiValue(expense.source_id)}</TableCell>
			<TableCell className="text-right">
				<ExpenseTableActions expense={expense} onEdit={onEdit} onDelete={onDelete} />
			</TableCell>
		</TableRow>
	)
}
