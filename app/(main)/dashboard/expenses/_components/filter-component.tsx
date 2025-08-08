"use client"

import { useQuery } from "@tanstack/react-query"
import { Filter, Loader2, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { getCategories } from "@/actions/category.actions"
import { getSources } from "@/actions/source.actions"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

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

	// Amount range state for slider
	const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000])
	const maxAmount = 50000 // You might want to make this dynamic based on your data

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
			const updatedFilter = {
				...filter,
				amount_min: amountRange[0] > 0 ? amountRange[0] : undefined,
				amount_max: amountRange[1] < maxAmount ? amountRange[1] : undefined,
			}
			onFilterChange(updatedFilter)
		}, 500)

		return () => clearTimeout(timer)
	}, [filter, amountRange, onFilterChange, maxAmount])

	if (isLoading || !categories || !sources) {
		return (
			<div className="flex h-32 items-center justify-center">
				<Loader2 className="h-6 w-6 animate-spin" />
				<span className="text-muted-foreground ml-2 text-sm">Loading filters...</span>
			</div>
		)
	}

	// Update filter state
	const updateFilter = <T,>(key: keyof ExpenseFilter, value: T) => {
		setFilter((prev) => ({ ...prev, [key]: value }))
	}

	// Handle amount range changes
	const handleAmountRangeChange = (values: number[]) => {
		if (values.length === 2 && values[0] !== undefined && values[1] !== undefined) {
			setAmountRange([values[0], values[1]])
		}
	}

	// Clear all filters
	const clearFilters = () => {
		setFilter({
			date_from: undefined,
			date_to: undefined,
			sort_by: "date",
			order: "desc",
		})
		setAmountRange([0, maxAmount])
	}

	// Check if any filters are active
	const hasActiveFilters =
		filter.search ||
		filter.date_from ||
		filter.date_to ||
		filter.category_id ||
		filter.source_id ||
		// Sorting considered active when deviating from defaults
		(filter.sort_by && filter.sort_by !== "date") ||
		(filter.order && filter.order !== "desc") ||
		amountRange[0] > 0 ||
		amountRange[1] < maxAmount

	return (
		<div className="space-y-4">
			<Accordion type="single" collapsible defaultValue="filters" className="rounded-lg border">
				<AccordionItem value="filters" className="border-0">
					<AccordionTrigger className="px-4 hover:no-underline">
						<div className="flex w-full items-center justify-between">
							<div className="flex items-center gap-2">
								<Filter className="text-muted-foreground h-4 w-4" />
								<span className="font-medium">Filters</span>
							</div>
							<span className="text-muted-foreground text-xs">
								{[
									filter.search && "Search",
									(filter.date_from || filter.date_to) && "Date Range",
									(amountRange[0] > 0 || amountRange[1] < maxAmount) && "Amount Range",
									filter.category_id && "Category",
									filter.source_id && "Source",
									((filter.sort_by && filter.sort_by !== "date") || (filter.order && filter.order !== "desc")) &&
										"Sorting",
								]
									.filter(Boolean)
									.join(" • ") || "None"}
							</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="px-4 pb-4">
						<div className="space-y-6">
							{/* Search */}
							<div className="relative">
								<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
								<Input
									name="search"
									placeholder="Search by title, description, or amount..."
									className="pl-10"
									value={filter.search || ""}
									onChange={(e) => updateFilter("search", e.target.value)}
								/>
							</div>

							{/* Top filters row: Date range + selects */}
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
								<div className="lg:col-span-2">
									<Label className="mb-2 block text-sm font-medium">Date Range</Label>
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

								<div className="space-y-2">
									<Label className="text-sm font-medium">Category</Label>
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

								<div className="space-y-2">
									<Label className="text-sm font-medium">Source</Label>
									<Select
										value={filter.source_id?.toString() || "all-sources"}
										onValueChange={(value) =>
											updateFilter("source_id", value === "all-sources" ? undefined : Number(value))
										}
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

								<div className="space-y-2">
									<Label className="text-sm font-medium">Sort By</Label>
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

								<div className="space-y-2">
									<Label className="text-sm font-medium">Order</Label>
									<Select
										value={filter.order || "desc"}
										onValueChange={(value) => updateFilter("order", value as "asc" | "desc")}
									>
										<SelectTrigger>
											<SelectValue placeholder="Order" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="desc">Newest First</SelectItem>
											<SelectItem value="asc">Oldest First</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Amount range */}
							<div className="space-y-4">
								<Label className="text-sm font-medium">Amount Range</Label>
								<div className="px-2">
									<Slider
										value={amountRange}
										onValueChange={handleAmountRangeChange}
										max={maxAmount}
										min={0}
										step={50}
										className="w-full"
									/>
								</div>
								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground">Min:</span>
										<span className="font-medium">${amountRange[0].toLocaleString()}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground">Max:</span>
										<span className="font-medium">
											{amountRange[1] >= maxAmount ? "No limit" : `$${amountRange[1].toLocaleString()}`}
										</span>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-end">
								{hasActiveFilters && (
									<Button variant="outline" onClick={clearFilters} className="gap-2">
										<X className="h-4 w-4" />
										Clear All
									</Button>
								)}
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}
