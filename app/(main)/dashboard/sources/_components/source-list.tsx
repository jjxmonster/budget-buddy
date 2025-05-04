"use client"

import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSourceMutations } from "@/query-options/source/mutations"
import { getSources } from "@/services/source.service"
import { SourceDTO } from "@/types/types"
import { CreateSourceForm } from "./create-source-form"
import { DeleteSourceDialog } from "./delete-source-dialog"
import { EditSourceForm } from "./edit-source-form"
import { SourceTable } from "./source-table"

export function SourceList() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
	const [sourceToEdit, setSourceToEdit] = useState<SourceDTO | null>(null)
	const [sourceToDelete, setSourceToDelete] = useState<SourceDTO | null>(null)

	const { deleteMutation } = useSourceMutations()

	const { data: sources = [], isLoading } = useQuery({
		queryKey: ["sources"],
		queryFn: getSources,
	})

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Sources</h1>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Source
				</Button>
			</div>

			<SourceTable sources={sources} isLoading={isLoading} onEdit={setSourceToEdit} onDelete={setSourceToDelete} />

			{isCreateDialogOpen && (
				<CreateSourceForm
					onSuccess={() => setIsCreateDialogOpen(false)}
					onCancel={() => setIsCreateDialogOpen(false)}
				/>
			)}

			{sourceToEdit && (
				<EditSourceForm
					source={sourceToEdit}
					onSuccess={() => setSourceToEdit(null)}
					onCancel={() => setSourceToEdit(null)}
				/>
			)}

			<DeleteSourceDialog
				source={sourceToDelete}
				isOpen={sourceToDelete !== null}
				onClose={() => setSourceToDelete(null)}
				onConfirm={() => {
					if (sourceToDelete) {
						deleteMutation.mutate(sourceToDelete.id)
						setSourceToDelete(null)
					}
				}}
			/>
		</div>
	)
}
