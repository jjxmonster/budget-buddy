"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { ExpenseDTO } from "@/types/types"
import { formatDate } from "@/utils/helpers"
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
		<TableRow data-testid={`expense-row-${expense.id}`}>
			<TableCell data-testid="expense-title">{expense.title}</TableCell>
			<TableCell data-testid="expense-description">{expense.description || "-"}</TableCell>
			<TableCell data-testid="expense-date">{formatDate(expense.date)}</TableCell>
			<TableCell className="text-right" data-testid="expense-amount">
				${expense.amount.toFixed(2)}
			</TableCell>
			<TableCell data-testid="expense-category">{formatApiValue(expense.category?.name || null)}</TableCell>
			<TableCell data-testid="expense-source">{formatApiValue(expense.source?.name || null)}</TableCell>
			<TableCell className="text-right">
				<ExpenseTableActions expense={expense} onEdit={onEdit} onDelete={onDelete} />
			</TableCell>
		</TableRow>
	)
}
