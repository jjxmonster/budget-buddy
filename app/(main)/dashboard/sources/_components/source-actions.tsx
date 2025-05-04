"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SourceDTO } from "@/types/types"

interface SourceActionsProps {
	source: SourceDTO
	onEdit: () => void
	onDelete: () => void
}

export function SourceActions({ source, onEdit, onDelete }: SourceActionsProps) {
	return (
		<div className="flex items-center gap-2">
			<Button
				variant="ghost"
				size="icon"
				onClick={onEdit}
				aria-label={`Edit ${source.name}`}
				data-testid={`edit-source-${source.id}`}
			>
				<Edit className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				onClick={onDelete}
				aria-label={`Delete ${source.name}`}
				data-testid={`delete-source-${source.id}`}
			>
				<Trash2 className="text-destructive h-4 w-4" />
			</Button>
		</div>
	)
}
