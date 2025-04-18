"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ExpenseDTO } from "@/types/types"
import { ExpenseTable } from "./expense-table"
// import { ConfirmationModal } from "./confirmation-modal"
// import { ExpenseFormModal } from "./expense-form-modal"

export function DashboardExpenseView() {
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

	const handleFormSubmit = async (values: ExpenseDTO) => {
		try {
			// API call will be implemented in the next step
			toast.success(`Expense ${formMode === "add" ? "added" : "updated"} successfully`)
			setIsFormModalOpen(false)
		} catch (error) {
			toast.error("Failed to save expense. Please try again.")
		}
	}

	const handleDeleteConfirm = async () => {
		if (!selectedExpense) return

		try {
			// API call will be implemented in the next step
			toast.success("Expense deleted successfully")
			setIsDeleteModalOpen(false)
		} catch (error) {
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

			{/* <ExpenseFormModal
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
			/> */}
		</div>
	)
}
