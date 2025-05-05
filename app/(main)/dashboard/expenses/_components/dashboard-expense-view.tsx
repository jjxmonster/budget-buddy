"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { ChatButton } from "@/app/(main)/dashboard/expenses/_components/chat-button"
import { ConfirmationModal } from "@/app/(main)/dashboard/expenses/_components/confirmation-modal"
import { ExpenseFormModal, ExpenseFormValues } from "@/app/(main)/dashboard/expenses/_components/expense-form-modal"
import { ExpenseTable } from "@/app/(main)/dashboard/expenses/_components/expense-table/expense-table"
import { Button } from "@/components/ui/button"
import { useExpenseMutations } from "@/query-options/expense/mutations"
import { CreateExpenseCommand, ExpenseDTO, UpdateExpenseCommand } from "@/types/types"

export function DashboardExpenseView() {
	const [isFormModalOpen, setIsFormModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [selectedExpense, setSelectedExpense] = useState<ExpenseDTO | null>(null)
	const [formMode, setFormMode] = useState<"add" | "edit">("add")

	const { createMutation, updateMutation, deleteMutation } = useExpenseMutations()

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
		const formattedValues = {
			...values,
			date: values.date.toISOString(),
		}

		if (formMode === "add") {
			const createCommand: CreateExpenseCommand = {
				...formattedValues,
			}
			createMutation.mutate(createCommand)
		} else if (selectedExpense) {
			const updateCommand: UpdateExpenseCommand = {
				...formattedValues,
				id: selectedExpense.id,
			}
			updateMutation.mutate(updateCommand)
		}

		setIsFormModalOpen(false)
	}

	const handleDeleteConfirm = async () => {
		if (!selectedExpense) return
		deleteMutation.mutate(selectedExpense.id)
		setIsDeleteModalOpen(false)
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Expenses</h1>
				<Button onClick={handleAddExpense} data-testid="add-expense-button">
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

			{/* Chat Button */}
			<ChatButton />
		</div>
	)
}
