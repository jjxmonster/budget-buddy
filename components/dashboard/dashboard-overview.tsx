"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { CategoryCountDto, DailyTotalDto, RecentExpenseDto } from "@/actions/dashboard.actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type DashboardOverviewProps = {
	dailyTotals: DailyTotalDto[]
	categoryCounts: CategoryCountDto[]
	recentExpenses: RecentExpenseDto[]
}

// colors used to decorate Pie slices consistently with theme tokens

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

const barChartConfig = {
	amount: {
		label: "Amount",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig

export default function DashboardOverview({ dailyTotals, categoryCounts, recentExpenses }: DashboardOverviewProps) {
	const totalThisMonth = React.useMemo(() => dailyTotals.reduce((sum, d) => sum + d.amount, 0), [dailyTotals])

	return (
		<div className="g:grid-cols-2 grid gap-6">
			<div className="col-span-2">
				<Card className="overflow-hidden">
					<CardHeader className="flex items-center justify-between gap-2 sm:flex-row">
						<div>
							<CardTitle>Spending - Last 30 days</CardTitle>
							<CardDescription>Daily expenses for the past month</CardDescription>
						</div>
						<div className="text-right">
							<div className="text-muted-foreground text-xs">Total</div>
							<div className="text-3xl font-bold">${totalThisMonth.toLocaleString()}</div>
						</div>
					</CardHeader>
					<CardContent>
						<ChartContainer config={barChartConfig} className="h-[300px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={dailyTotals} margin={{ left: 8, right: 8 }}>
									<CartesianGrid vertical={false} strokeOpacity={0.2} />
									<XAxis
										dataKey="date"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										minTickGap={24}
										tickFormatter={(value) => {
											const date = new Date(value)
											return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
										}}
									/>
									<YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
									<ChartTooltip content={<ChartTooltipContent className="w-[160px]" />} />
									<Bar dataKey="amount" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			<div className="col-span-2 grid gap-6 md:grid-cols-2">
				<Card className="flex flex-col">
					<CardHeader className="items-center pb-0">
						<CardTitle>By Category</CardTitle>
						<CardDescription>Number of expenses per category</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 pb-0">
						<ChartContainer
							config={{
								value: { label: "Count" },
								category1: { color: "var(--chart-1)" },
								category2: { color: "var(--chart-2)" },
								category3: { color: "var(--chart-3)" },
								category4: { color: "var(--chart-4)" },
								category5: { color: "var(--chart-5)" },
							}}
							className="mx-auto aspect-square max-h-[260px]"
						>
							<PieChart>
								<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="w-[160px]" />} />
								<Pie
									data={categoryCounts.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }))}
									dataKey="value"
									nameKey="name"
									stroke="0"
								/>
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent expenses</CardTitle>
						<CardDescription>Last 5 transactions</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead className="text-right">Amount</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Category</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentExpenses.map((e) => (
										<TableRow key={e.id}>
											<TableCell className="font-medium">{e.title}</TableCell>
											<TableCell className="text-right">${e.amount.toLocaleString()}</TableCell>
											<TableCell>{e.date}</TableCell>
											<TableCell className="text-muted-foreground">{e.category || "-"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
