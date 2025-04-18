"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmationModal } from "@/app/(main)/dashboard/expenses/_components/confirmation-modal"
import { ExpenseFormModal, ExpenseFormValues } from "@/app/(main)/dashboard/expenses/_components/expense-form-modal"
import { ExpenseTable } from "@/app/(main)/dashboard/expenses/_components/expense-table"
import { Button } from "@/components/ui/button"
import { getQueryClient } from "@/lib/get-query-client"
import { createExpense, deleteExpense, updateExpense } from "@/services/expense.service"
import { CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "@/types/types"

export const DEFAULT_USER_ID = "e34f411a-6c4c-46d8-844f-c6f2fcc8b6f6"

export function DashboardExpenseView() {
	const queryClient = getQueryClient()
	const [isFormModalOpen, setIsFormModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [selectedExpense, setSelectedExpense] = useState<ExpenseDTO | null>(null)
	const [formMode, setFormMode] = useState<"add" | "edit">("add")

	const handleAddExpense = () => {
		setFormMode("add")
		setSelectedExpense(null)
		setIsFormModalOpen(true)
	}

	const handleEditExpense = (expense: ExpenseDTO) => {
		setFormMode("edit")
		setSelectedExpense(expense)
		setIsFormModalOpen(true)
	}

	const handleDeleteExpense = (expense: ExpenseDTO) => {
		setSelectedExpense(expense)
		setIsDeleteModalOpen(true)
	}

	const handleFormSubmit = async (values: ExpenseFormValues) => {
		try {
			const formattedValues = {
				...values,
				date: values.date.toISOString(),
			}

			if (formMode === "add") {
				const createCommand: CreateExpenseCommand = {
					...formattedValues,
					user_id: DEFAULT_USER_ID,
				}
				await createExpense(createCommand)
			} else if (selectedExpense) {
				const updateCommand: UpdateExpenseCommand = {
					...formattedValues,
					id: selectedExpense.id,
				}
				await updateExpense(updateCommand)
			}

			await queryClient.invalidateQueries({ queryKey: ["expenses"] })

			toast.success(`Expense ${formMode === "add" ? "added" : "updated"} successfully`)
			setIsFormModalOpen(false)
		} catch {
			toast.error("Failed to save expense. Please try again.")
		}
	}

	const handleDeleteConfirm = async () => {
		if (!selectedExpense) return

		try {
			await deleteExpense(selectedExpense.id)

			await queryClient.invalidateQueries({ queryKey: ["expenses"] })

			toast.success("Expense deleted successfully")
			setIsDeleteModalOpen(false)
		} catch {
			toast.error("Failed to delete expense. Please try again.")
		}
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Expenses</h1>
				<Button onClick={handleAddExpense}>
					<Plus className="mr-2 h-4 w-4" />
					Add Expense
				</Button>
			</div>

			<ExpenseTable onEdit={handleEditExpense} onDelete={handleDeleteExpense} />

			<ExpenseFormModal
				open={isFormModalOpen}
				mode={formMode}
				defaultValues={selectedExpense}
				onClose={() => setIsFormModalOpen(false)}
				onSubmit={handleFormSubmit}
			/>

			<ConfirmationModal
				open={isDeleteModalOpen}
				message="Are you sure you want to delete this expense?"
				onConfirm={handleDeleteConfirm}
				onCancel={() => setIsDeleteModalOpen(false)}
			/>
		</div>
	)
}
