"use server"

import { createClient } from "@/db/supabase.client"

export interface DailyTotalDto {
	date: string
	amount: number
}

export interface CategoryCountDto {
	name: string
	value: number
}

export interface RecentExpenseDto {
	id: number
	title: string
	amount: number
	date: string
	category: string | null
}

function formatDateIso(date: Date): string {
	return date.toISOString().slice(0, 10)
}

export async function getDashboardMetrics(): Promise<{
	dailyTotals: DailyTotalDto[]
	categoryCounts: CategoryCountDto[]
	recentExpenses: RecentExpenseDto[]
}> {
	const supabase = await createClient()
	const { data: userData, error: sessionError } = await supabase.auth.getUser()

	if (sessionError) {
		throw new Error(sessionError.message)
	}

	const userId = userData.user?.id || ""

	const today = new Date()
	const start = new Date()
	start.setDate(today.getDate() - 29)
	const startIso = formatDateIso(start)

	// Fetch required slices in parallel
	const [expensesForTotals, expensesForCategories, recent] = await Promise.all([
		supabase
			.from("expense")
			.select("date, amount")
			.eq("user_id", userId)
			.gte("date", startIso)
			.order("date", { ascending: true }),
		supabase.from("expense").select("date, category:category_id(name)").eq("user_id", userId).gte("date", startIso),
		supabase
			.from("expense")
			.select("id, title, amount, date, category:category_id(name)")
			.eq("user_id", userId)
			.order("date", { ascending: false })
			.limit(5),
	])

	if (expensesForTotals.error) {
		throw new Error(`Failed to fetch totals: ${expensesForTotals.error.message}`)
	}
	if (expensesForCategories.error) {
		throw new Error(`Failed to fetch categories: ${expensesForCategories.error.message}`)
	}
	if (recent.error) {
		throw new Error(`Failed to fetch recent: ${recent.error.message}`)
	}

	// Aggregate daily totals and fill missing days
	const totalsMap = new Map<string, number>()
	;((expensesForTotals.data || []) as Array<{ date: string; amount: number }>).forEach((row) => {
		const key = row.date
		totalsMap.set(key, (totalsMap.get(key) || 0) + Number(row.amount || 0))
	})

	const dailyTotals: DailyTotalDto[] = []
	for (let i = 0; i < 30; i++) {
		const d = new Date(start)
		d.setDate(start.getDate() + i)
		const key = formatDateIso(d)
		dailyTotals.push({ date: key, amount: Number(totalsMap.get(key) || 0) })
	}

	// Aggregate category counts (over the last 30 days)
	const categoryMap = new Map<string, number>()
	;((expensesForCategories.data || []) as Array<{ category: unknown }>).forEach((row) => {
		let name = "Uncategorized"
		const cat = row.category as unknown
		if (Array.isArray(cat)) {
			name = (cat[0]?.name as string | undefined) ?? name
		} else if (cat && typeof cat === "object") {
			name = ((cat as { name?: string }).name as string | undefined) ?? name
		}
		categoryMap.set(name, (categoryMap.get(name) || 0) + 1)
	})
	const categoryCounts: CategoryCountDto[] = Array.from(categoryMap.entries()).map(([name, value]) => ({
		name,
		value,
	}))

	// Recent expenses normalize
	const recentExpenses: RecentExpenseDto[] = (
		(recent.data || []) as Array<{
			id: number
			title: string
			amount: number
			date: string
			category: unknown
		}>
	).map((e) => {
		let catName: string | null = null
		const cat = e.category as unknown
		if (Array.isArray(cat)) {
			catName = (cat[0]?.name as string | undefined) ?? null
		} else if (cat && typeof cat === "object") {
			catName = ((cat as { name?: string }).name as string | undefined) ?? null
		}
		return {
			id: e.id,
			title: e.title,
			amount: Number(e.amount || 0),
			date: e.date,
			category: catName,
		}
	})

	return { dailyTotals, categoryCounts, recentExpenses }
}
