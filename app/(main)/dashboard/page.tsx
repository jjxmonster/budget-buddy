import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDashboardMetrics } from "@/actions/dashboard.actions"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import { createClient } from "@/db/supabase.client"

export const metadata: Metadata = {
	title: "Dashboard | Budget Buddy",
	description: "Overview of your spending and categories",
}

export default async function DashboardPage() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getUser()

	if (error || !data?.user) {
		redirect("/auth/login")
	}

	const metrics = await getDashboardMetrics()

	return (
		<div className="container mx-auto space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Dashboard</h1>
			</div>
			<DashboardOverview
				dailyTotals={metrics.dailyTotals}
				categoryCounts={metrics.categoryCounts}
				recentExpenses={metrics.recentExpenses}
			/>
		</div>
	)
}
