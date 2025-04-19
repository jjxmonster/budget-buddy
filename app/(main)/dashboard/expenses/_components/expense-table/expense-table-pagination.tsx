"use client"

import { ReactNode } from "react"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

interface ExpenseTablePaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

export function ExpenseTablePagination({ currentPage, totalPages, onPageChange }: ExpenseTablePaginationProps) {
	const renderPaginationItems = () => {
		const items: ReactNode[] = []

		const addPageButton = (pageNum: number) => {
			items.push(
				<PaginationItem key={pageNum}>
					<PaginationLink isActive={pageNum === currentPage} onClick={() => onPageChange(pageNum)}>
						{pageNum}
					</PaginationLink>
				</PaginationItem>
			)
		}

		const addEllipsis = (key: string) => {
			items.push(
				<PaginationItem key={key}>
					<PaginationEllipsis />
				</PaginationItem>
			)
		}

		addPageButton(1)

		let startPage: number
		let endPage: number

		if (totalPages <= 5) {
			startPage = 2
			endPage = totalPages - 1
		} else {
			if (currentPage <= 3) {
				startPage = 2
				endPage = 4
				if (totalPages > 5) {
					addEllipsis("ellipsis-end")
				}
			} else if (currentPage >= totalPages - 2) {
				startPage = totalPages - 3
				endPage = totalPages - 1
				if (startPage > 2) {
					addEllipsis("ellipsis-start")
				}
			} else {
				startPage = currentPage - 1
				endPage = currentPage + 1
				if (startPage > 2) {
					addEllipsis("ellipsis-start")
				}
				if (endPage < totalPages - 1) {
					addEllipsis("ellipsis-end")
				}
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			if (i > 1 && i < totalPages) {
				addPageButton(i)
			}
		}

		if (totalPages > 1) {
			addPageButton(totalPages)
		}

		return items
	}

	return (
		<Pagination className="my-4">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
						aria-disabled={currentPage === 1}
						className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
					/>
				</PaginationItem>

				{renderPaginationItems()}

				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
						aria-disabled={currentPage === totalPages}
						className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}
