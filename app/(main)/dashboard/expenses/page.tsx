import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Metadata } from "next"
import { getQueryClient } from "@/lib/get-query-client"
import { getExpenses } from "@/services/expense.service"
import { DashboardExpenseView } from "./_components/dashboard-expense-view"

export const metadata: Metadata = {
	title: "Expenses | Budget Buddy",
	description: "Manage your expenses efficiently with Budget Buddy",
}

export default async function ExpensesPage() {
	const queryClient = getQueryClient()

	const defaultFilter = {
		sort_by: "date",
		order: "desc" as const,
	}

	// Prefetch the first page of expenses with default filters
	await queryClient.prefetchQuery({
		queryKey: ["expenses", defaultFilter, 1, 10],
		queryFn: () => getExpenses(defaultFilter, 1, 10),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="container mx-auto py-6">
				<DashboardExpenseView />
			</div>
		</HydrationBoundary>
	)
}
