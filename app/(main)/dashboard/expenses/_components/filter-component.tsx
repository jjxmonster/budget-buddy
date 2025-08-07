"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2, Search, X, DollarSign, Filter, Calendar, Tag, ArrowUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import { getCategories } from "@/actions/category.actions"
import { getSources } from "@/actions/source.actions"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
				<span className="ml-2 text-sm text-muted-foreground">Loading filters...</span>
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
		amountRange[0] > 0 ||
		amountRange[1] < maxAmount

	return (
		<div className="space-y-6">
			{/* Header with Clear Filters */}
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold">Filter Expenses</h3>
					<p className="text-sm text-muted-foreground">
						Narrow down your expenses using the filters below
					</p>
				</div>
				{hasActiveFilters && (
					<Button variant="outline" onClick={clearFilters} className="gap-2">
						<X className="h-4 w-4" />
						Clear All
					</Button>
				)}
			</div>

			{/* Filters Accordion */}
			<Accordion type="multiple" defaultValue={["search", "date-range"]} className="space-y-0">
				
				{/* Search Filter */}
				<AccordionItem value="search">
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<span>Search</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pb-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search by title, description, or amount..."
								className="pl-10"
								value={filter.search || ""}
								onChange={(e) => updateFilter("search", e.target.value)}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Date Range Filter */}
				<AccordionItem value="date-range">
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span>Date Range</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pb-6">
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
					</AccordionContent>
				</AccordionItem>

				{/* Amount Range Filter */}
				<AccordionItem value="amount-range">
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<span>Amount Range</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pb-6">
						<div className="space-y-4">
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
					</AccordionContent>
				</AccordionItem>

				{/* Category and Source Filters */}
				<AccordionItem value="category-source">
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<Tag className="h-4 w-4 text-muted-foreground" />
							<span>Category & Source</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pb-6">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							{/* Category filter */}
							<div className="space-y-3">
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

							{/* Source filter */}
							<div className="space-y-3">
								<Label className="text-sm font-medium">Source</Label>
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
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Sorting Options */}
				<AccordionItem value="sorting">
					<AccordionTrigger className="hover:no-underline">
						<div className="flex items-center gap-2">
							<ArrowUpDown className="h-4 w-4 text-muted-foreground" />
							<span>Sorting</span>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pb-6">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							{/* Sort by */}
							<div className="space-y-3">
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

							{/* Order */}
							<div className="space-y-3">
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
					</AccordionContent>
				</AccordionItem>

			</Accordion>

			{/* Active Filters Summary */}
			{hasActiveFilters && (
				<div className="rounded-lg border bg-muted/50 p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-primary"></div>
							<span className="text-sm font-medium">Active Filters</span>
						</div>
						<span className="text-xs text-muted-foreground">
							{[
								filter.search && "Search",
								(filter.date_from || filter.date_to) && "Date Range",
								(amountRange[0] > 0 || amountRange[1] < maxAmount) && "Amount Range",
								filter.category_id && "Category",
								filter.source_id && "Source"
							].filter(Boolean).join(" • ")}
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
