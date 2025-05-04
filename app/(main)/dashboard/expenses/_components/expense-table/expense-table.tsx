"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getExpenses, PaginatedResult } from "@/services/expense.service"
import { ExpenseDTO } from "@/types/types"
import { ExpenseTablePagination } from "./expense-table-pagination"
import { ExpenseTableRow } from "./expense-table-row"
import { ExpensesLoading } from "./expenses-loading"
import { ExpenseFilter, FilterComponent } from "../filter-component"

interface ExpenseTableProps {
	onEdit: (expense: ExpenseDTO) => void
	onDelete: (expense: ExpenseDTO) => void
}

export function ExpenseTable({ onEdit, onDelete }: ExpenseTableProps) {
	const [filter, setFilter] = useState<ExpenseFilter>({
		sort_by: "date",
		order: "desc",
	})
	const [currentPage, setCurrentPage] = useState(1)
	const pageSize = 10

	const {
		data: expensesData,
		isLoading,
		error,
	} = useQuery<PaginatedResult<ExpenseDTO>>({
		queryKey: ["expenses", filter, currentPage, pageSize],
		queryFn: () => getExpenses(filter, currentPage, pageSize),
	})

	const expenses = expensesData?.data || []
	const totalCount = expensesData?.count || 0
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

	const handleFilterChange = (newFilter: ExpenseFilter) => {
		if (JSON.stringify(filter) !== JSON.stringify(newFilter)) {
			setFilter(newFilter)
			setCurrentPage(1)
		}
	}

	const handlePageChange = (page: number) => {
		if (page !== currentPage) {
			setCurrentPage(page)
		}
	}

	if (error) {
		return (
			<div className="text-muted-foreground rounded-md border p-4 text-center text-sm">
				Error loading expenses. Please try again later.
			</div>
		)
	}

	return (
		<div className="space-y-4" data-testid="expense-table-container">
			<FilterComponent onFilterChange={handleFilterChange} />

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
					<TableBody data-testid="expense-table-body">
						{isLoading ? (
							<ExpensesLoading />
						) : expenses.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center">
									No expenses found.
								</TableCell>
							</TableRow>
						) : (
							expenses.map((expense) => (
								<ExpenseTableRow key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
							))
						)}
					</TableBody>
				</Table>
			</div>

			{!isLoading && totalPages > 1 && (
				<ExpenseTablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
			)}
		</div>
	)
}
