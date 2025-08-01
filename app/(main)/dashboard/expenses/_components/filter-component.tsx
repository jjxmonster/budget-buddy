"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { getCategories } from "@/actions/category.actions"
import { getSources } from "@/actions/source.actions"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface ExpenseFilter {
	search?: string
	date_from?: Date
	date_to?: Date
	amount_min?: number
	amount_max?: number
	category_id?: number
	source_id?: number
	sort_by?: string
	order?: "asc" | "desc"
}

interface FilterComponentProps {
	onFilterChange: (filter: ExpenseFilter) => void
}

export function FilterComponent({ onFilterChange }: FilterComponentProps) {
	const [filter, setFilter] = useState<ExpenseFilter>({
		date_from: undefined,
		date_to: undefined,
		sort_by: "date",
		order: "desc",
	})

	const { data: categories, isLoading: isCategoriesLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	})

	const { data: sources, isLoading: isSourcesLoading } = useQuery({
		queryKey: ["sources"],
		queryFn: () => getSources(),
	})

	const isLoading = isCategoriesLoading || isSourcesLoading

	useEffect(() => {
		const timer = setTimeout(() => {
			onFilterChange(filter)
		}, 500)

		return () => clearTimeout(timer)
	}, [filter, onFilterChange])

	if (isLoading || !categories || !sources) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-4 w-4 animate-spin" />
			</div>
		)
	}

	// Update filter state
	const updateFilter = <T,>(key: keyof ExpenseFilter, value: T) => {
		setFilter((prev) => ({ ...prev, [key]: value }))
	}

	// Clear all filters
	const clearFilters = () => {
		setFilter({
			date_from: undefined,
			date_to: undefined,
			sort_by: "date",
			order: "desc",
		})
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{/* Search */}
				<div className="relative">
					<Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
					<Input
						placeholder="Search expenses..."
						className="pl-8"
						value={filter.search || ""}
						onChange={(e) => updateFilter("search", e.target.value)}
					/>
				</div>

				{/* Date range */}
				<div>
					<DateRangePicker
						onUpdate={(values) => {
							updateFilter("date_from", values.range.from)
							updateFilter("date_to", values.range.to)
						}}
						initialDateFrom={filter.date_from}
						initialDateTo={filter.date_to}
						align="start"
						showCompare={false}
					/>
				</div>

				{/* Amount range */}
				<div className="flex gap-2">
					<div className="flex-1">
						<Input
							type="number"
							placeholder="Min $"
							value={filter.amount_min || ""}
							onChange={(e) => updateFilter("amount_min", e.target.valueAsNumber)}
						/>
					</div>
					<div className="flex-1">
						<Input
							type="number"
							placeholder="Max $"
							value={filter.amount_max || ""}
							onChange={(e) => updateFilter("amount_max", e.target.valueAsNumber)}
						/>
					</div>
				</div>

				{/* Clear filters */}
				<Button variant="outline" onClick={clearFilters} className="gap-2">
					<X className="h-4 w-4" />
					Clear Filters
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{/* Category filter */}
				<div>
					<Select
						value={filter.category_id?.toString() || "all-categories"}
						onValueChange={(value) =>
							updateFilter("category_id", value === "all-categories" ? undefined : Number(value))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-categories">All Categories</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id.toString()}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Source filter */}
				<div>
					<Select
						value={filter.source_id?.toString() || "all-sources"}
						onValueChange={(value) => updateFilter("source_id", value === "all-sources" ? undefined : Number(value))}
					>
						<SelectTrigger>
							<SelectValue placeholder="All Sources" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-sources">All Sources</SelectItem>
							{sources.map((source) => (
								<SelectItem key={source.id} value={source.id.toString()}>
									{source.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Sort by */}
				<div>
					<Select value={filter.sort_by || "date"} onValueChange={(value) => updateFilter("sort_by", value)}>
						<SelectTrigger>
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="date">Date</SelectItem>
							<SelectItem value="amount">Amount</SelectItem>
							<SelectItem value="title">Title</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Order */}
				<div>
					<Select
						value={filter.order || "desc"}
						onValueChange={(value) => updateFilter("order", value as "asc" | "desc")}
					>
						<SelectTrigger>
							<SelectValue placeholder="Order" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="desc">Descending</SelectItem>
							<SelectItem value="asc">Ascending</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}
