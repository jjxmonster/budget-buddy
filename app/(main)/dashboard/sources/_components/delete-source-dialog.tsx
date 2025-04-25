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
import { SourceDTO } from "@/types/types"

interface DeleteSourceDialogProps {
	source: SourceDTO | null
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
}

export function DeleteSourceDialog({ source, isOpen, onClose, onConfirm }: DeleteSourceDialogProps) {
	if (!source) return null

	return (
		<AlertDialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Source</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the source &quot;{source.name}&quot;? This action cannot be undone.
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
