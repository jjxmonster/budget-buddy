"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryDTO } from "@/types/types"

interface CategoryActionsProps {
	category: CategoryDTO
	onEdit: () => void
	onDelete: () => void
}

export function CategoryActions({ category, onEdit, onDelete }: CategoryActionsProps) {
	return (
		<div className="flex items-center gap-2" data-testid={`category-actions-${category.id}`}>
			<Button
				variant="ghost"
				size="icon"
				onClick={onEdit}
				aria-label={`Edit ${category.name}`}
				data-testid={`edit-category-${category.id}`}
			>
				<Edit className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				onClick={onDelete}
				aria-label={`Delete ${category.name}`}
				data-testid={`delete-category-${category.id}`}
			>
				<Trash2 className="text-destructive h-4 w-4" />
			</Button>
		</div>
	)
}
