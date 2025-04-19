"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExpenseDTO } from "@/types/types"

interface ExpenseTableActionsProps {
	expense: ExpenseDTO
	onEdit: (expense: ExpenseDTO) => void
	onDelete: (expense: ExpenseDTO) => void
}

export function ExpenseTableActions({ expense, onEdit, onDelete }: ExpenseTableActionsProps) {
	return (
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
	)
}
