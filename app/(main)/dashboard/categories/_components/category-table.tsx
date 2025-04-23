"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryDTO } from "@/types/types"
import { CategoryActions } from "./category-actions"

interface CategoryTableProps {
	categories: CategoryDTO[]
	isLoading?: boolean
	onEdit: (category: CategoryDTO) => void
	onDelete: (category: CategoryDTO) => void
}

export function CategoryTable({ categories, isLoading = false, onEdit, onDelete }: CategoryTableProps) {
	if (isLoading) {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-[250px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-8 w-[80px]" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		)
	}

	if (categories.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="mb-4 text-lg font-medium">No categories found</p>
				<p className="text-muted-foreground text-sm">Create your first category to get started.</p>
			</div>
		)
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead className="w-[100px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categories.map((category) => (
						<TableRow key={category.id}>
							<TableCell className="font-medium">{category.name}</TableCell>
							<TableCell>
								<CategoryActions
									category={category}
									onEdit={() => onEdit(category)}
									onDelete={() => onDelete(category)}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
