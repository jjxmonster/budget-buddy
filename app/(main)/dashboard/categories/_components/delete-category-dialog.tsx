"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CategoryDTO } from "@/types/types"

interface DeleteCategoryDialogProps {
	category: CategoryDTO | null
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
}

export function DeleteCategoryDialog({ category, isOpen, onClose, onConfirm }: DeleteCategoryDialogProps) {
	if (!category) return null

	return (
		<AlertDialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Category</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the category &quot;{category.name}&quot;? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
