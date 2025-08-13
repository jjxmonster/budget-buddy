"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SourceDTO } from "@/types/types"
import { SourceActions } from "./source-actions"

interface SourceTableProps {
	sources: SourceDTO[]
	isLoading?: boolean
	onEdit: (source: SourceDTO) => void
	onDelete: (source: SourceDTO) => void
}

export function SourceTable({ sources, isLoading = false, onEdit, onDelete }: SourceTableProps) {
	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-lg border p-2 sm:p-3 md:p-4">
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

	if (sources.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="mb-4 text-lg font-medium">No sources found</p>
				<p className="text-muted-foreground text-sm">Create your first source to get started.</p>
			</div>
		)
	}

	return (
		<div className="overflow-hidden rounded-lg border p-2 sm:p-3 md:p-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead className="w-[100px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody data-testid="source-table-body">
					{sources.map((source) => (
						<TableRow key={source.id} data-testid={`source-row-${source.id}`}>
							<TableCell className="font-medium">{source.name}</TableCell>
							<TableCell>
								<SourceActions source={source} onEdit={() => onEdit(source)} onDelete={() => onDelete(source)} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
